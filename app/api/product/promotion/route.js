import connectDB from "@/config/db";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from '@/lib/authSeller';

export async function PUT(req) {
  try {
    const { userId } = getAuth(req);
    const isSeller = await authSeller(userId);
    if (!userId || !isSeller) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const { productId, promotion } = await req.json();
    if (!productId || typeof promotion !== "boolean") {
      return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
    }
    await connectDB();
    const product = await Product.findOne({ _id: productId, userId });
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found or not owned by you" }, { status: 404 });
    }
    product.promotion = promotion;
    await product.save();
    return NextResponse.json({ success: true, message: "Promotion status updated", product });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}