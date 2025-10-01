
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
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({success: false, message: "Not authorized"}, { status: 401 })
        }

        // Accept JSON body with image URLs
        const body = await request.json();
        const { name, description, category, price, offerPrice, image } = body;

        if (!image || !Array.isArray(image) || image.length === 0) {
            return NextResponse.json({success: false, message: "No image URLs provided"});
        }
        // Optionally: validate URLs are Cloudinary links
        if (!image.every(url => typeof url === 'string' && url.startsWith('http'))) {
            return NextResponse.json({success: false, message: "Invalid image URLs"});
        }

        await connectDB();
    const realUserId = typeof userId === 'string' ? userId : userId?.userId;
        const newProduct = await Product.create({
            userId: realUserId,
            name,
            description,
            category,
            price: Number(price),
            offerPrice: Number(offerPrice),
            image,
            date: new Date()
        });
        return NextResponse.json({success: true, message: "Upload Successfully", newProduct});
    } catch (error) {
        return NextResponse.json({success: false, message: error.message});
    }
}