import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized" }, { status: 401 });
        }
        const body = await request.json();
        const { productId, name, description, category, price, offerPrice, image } = body;
        if (!productId) {
            return NextResponse.json({ success: false, message: "Missing product ID" }, { status: 400 });
        }
        await connectDB();
        const product = await Product.findOne({ _id: productId, userId });
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found or not owned by you" }, { status: 404 });
        }
        // Update fields
        product.name = name;
        product.description = description;
        product.category = category;
        product.price = price;
        product.offerPrice = offerPrice || 0;
        product.image = image;
        await product.save();
        return NextResponse.json({ success: true, message: "Product updated", product });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

