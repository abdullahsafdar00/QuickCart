import connectDB from "@/config/db";
import Address from "@/models/address";
import Order from "@/models/order";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = Math.min(parseInt(searchParams.get('limit')) || 10, 50);
        const status = searchParams.get('status');

        // Build query
        const query = { userId };
        if (status) query.status = status;

        const skip = (page - 1) * limit;

        // Optimized query with selective population
        const [orders, total] = await Promise.all([
            Order.find(query)
                .populate({
                    path: 'address',
                    select: 'fullName area city state'
                })
                .populate({
                    path: 'items.product',
                    select: 'name image price offerPrice'
                })
                .select('-courierMeta -paymentError')
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        const res = NextResponse.json({
            success: true,
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

        res.headers.set('Cache-Control', 'private, max-age=60');
        return res;

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}