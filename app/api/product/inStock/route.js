import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import Product from "@/models/product";
import connectDB from "@/config/db";

export async function PUT(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { productId, inStock } = await req.json();

    if (!productId || typeof inStock !== "boolean") {
      return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
    }

    await connectDB();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    product.inStock = inStock;
    await product.save();

    return NextResponse.json({ success: true, message: "Stock status updated", product });
  } catch (error) {
    console.error("Update inStock error:", error); // Debug line
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
