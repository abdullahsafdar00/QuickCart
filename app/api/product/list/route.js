import connectDB from "@/config/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        

        await connectDB();

        const products = await Product.find({})
        // Add a small cache window for CDN / browser (30s) to reduce DB reads under burst
        const res = NextResponse.json({success: true, products})
        res.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60')
        return res
    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}