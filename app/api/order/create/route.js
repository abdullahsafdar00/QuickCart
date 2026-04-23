import { inngest } from "@/config/inngest";
import connectDB from "@/config/db";
import Product from "@/models/product";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { address, items, courierName } = await request.json();

    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "No items in the order" });
    }

    await connectDB();

    // Calculate total
    let amount = 0;
    const itemDetails = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      const unitPrice = product.offerPrice > 0 ? product.offerPrice : product.price;
      amount += unitPrice * item.quantity;

      let priceHtml = `PKR${unitPrice}`;
      if (product.offerPrice && product.offerPrice > 0 && product.offerPrice < product.price) {
        priceHtml = `<span style='color:#888;text-decoration:line-through;'>PKR${product.price}</span> <span style='color:#EA580C;font-weight:bold;'>PKR${product.offerPrice}</span>`;
      }

      itemDetails.push({ name: product.name, price: priceHtml, quantity: item.quantity });
    }

    const totalAmount = amount + 250;

    // Mock Courier Booking
    let courierTrackingNumber = null;
    let courierStatus = "Booked";
    let courierMeta = {};
    if (courierName) {
      courierTrackingNumber = `${courierName.toUpperCase()}-${Math.floor(Math.random() * 100000000)}`;
      courierMeta = { bookedAt: new Date().toISOString(), courier: courierName };
    }

    // Fire Inngest event (handles order creation + emails)
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        itemDetails,
        amount: totalAmount,
        date: Date.now(),
        courierName,
        courierTrackingNumber,
        courierStatus,
        courierMeta,
      },
    });

    // Clear cart
    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: "Order Placed",
      courier: { courierName, courierTrackingNumber, courierStatus },
    });
  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
