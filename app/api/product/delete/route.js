import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request) {
  try {
    // Authenticate user
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 401 });
    }

    // Parse request data (assumes JSON body, better for DELETE)
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ success: false, message: "Missing product ID" }, { status: 400 });
    }

    // Connect to DB
    await connectDB();

    // Find product
    const product = await Product.findOne({ _id: productId, userId });
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Delete images from Cloudinary
    const imageDeleteResults = await Promise.all(
      product.image.map(async (url) => {
        const publicId = url.split("/").pop().split(".")[0]; // assumes image publicId is last part of URL
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
        } catch (err) {
          console.warn("Error deleting image:", publicId, err.message);
        }
      })
    );

    // Delete the product from the database
    const deleteResult = await Product.deleteOne({ _id: productId });

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
      result: deleteResult,
    });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
