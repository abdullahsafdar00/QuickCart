import connectDB from "@/config/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = Math.min(parseInt(searchParams.get('limit')) || 20, 100);
        const category = searchParams.get('category');
        const inStock = searchParams.get('inStock');
        const promotion = searchParams.get('promotion');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'date';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

        // Build query
        const query = {};
        if (category) query.category = category;
        if (inStock !== null) query.inStock = inStock === 'true';
        if (promotion !== null) query.promotion = promotion === 'true';
        if (search) {
            query.$text = { $search: search };
        }

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder;
        if (search) sort.score = { $meta: 'textScore' };

        const skip = (page - 1) * limit;

        // Execute query with pagination
        const [products, total] = await Promise.all([
            Product.find(query)
                .select('-description -__v')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        const res = NextResponse.json({
            success: true,
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

        res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
        return res;
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}