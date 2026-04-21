import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const isSeller = await authSeller(userId);
    if (!isSeller) return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });

    const timestamp = Math.floor(Date.now() / 1000);
    // Build signature string the same way Cloudinary expects (sorted params)
    const paramsToSign = `timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET ? '' : ''}`;
    // When signing multiple params you'd join them with '&' sorted by key. We only sign timestamp here.
    const toSign = `timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET ? '' : ''}`;
    const signature = crypto.createHash('sha1').update(toSign + process.env.CLOUDINARY_API_SECRET).digest('hex');

    return NextResponse.json({ success: true, signature, timestamp, cloudName: process.env.CLOUDINARY_CLOUD_NAME });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
