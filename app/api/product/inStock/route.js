import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import Product from "@/models/product";
import connectDB from "@/config/db";
import authSeller from '@/lib/authSeller';

export async function PUT(req) {
  try {
    const { userId } = getAuth(req);
    const isSeller = await authSeller(userId);

    if (!userId || !isSeller) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { productId, inStock } = await req.json();

    if (!productId || typeof inStock !== "boolean") {
      return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
    }

    await connectDB();

    const product = await Product.findOne({ _id: productId, userId });
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found or not owned by you" }, { status: 404 });
    }

    product.inStock = inStock;
    await product.save();

    return NextResponse.json({ success: true, message: "Stock status updated", product });
  } catch (error) {
    console.error("Update inStock error:", error); // Debug line
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
