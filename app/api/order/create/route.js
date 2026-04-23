import { inngest } from "@/config/inngest";
import Product from "@/models/product";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items, courierName, paymentMethod = 'cod' } = await request.json();

    if (!address || items.length === 0) {
      return NextResponse.json({ success: false, message: "No items in the order" });
    }

    // 1️⃣ Calculate total
    let amount = 0;
    const itemDetails = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      // Use offerPrice if available and > 0, else fallback to price
      const unitPrice = product.offerPrice > 0 ? product.offerPrice : product.price;
      amount += unitPrice * item.quantity;

      // For email: show both prices if discounted
      let priceHtml = `PKR${unitPrice}`;
      if (product.offerPrice && product.offerPrice > 0 && product.offerPrice < product.price) {
        priceHtml = `<span style='color:#888;text-decoration:line-through;'>PKR${product.price}</span> <span style='color:#EA580C;font-weight:bold;'>PKR${product.offerPrice}</span>`;
      }

      itemDetails.push({
        name: product.name,
        price: priceHtml,
        quantity: item.quantity,
      });
    }

    const totalAmount = amount + 250; 

    // 2️⃣ Mock Courier Booking
    let courierTrackingNumber = null;
    let courierStatus = 'Booked';
    let courierMeta = {};
    if (courierName) {
      // In real integration, call the courier API here
      // For now, mock tracking number and meta
      courierTrackingNumber = `${courierName.toUpperCase()}-${Math.floor(Math.random()*100000000)}`;
      courierMeta = { bookedAt: new Date().toISOString(), courier: courierName };
    }

    // 3️⃣ Fire Inngest event for persistence + background work (emails, courier booking)
    const orderData = {
      userId,
      address,
      items,
      amount: totalAmount,
      date: Date.now(),
      courierName,
      courierTrackingNumber,
      courierStatus,
      courierMeta,
      itemDetails,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'completed' : 'pending'
    };

    await inngest.send({
      name: 'order/created',
      data: orderData
    });

    // 4️⃣ Clear cart quickly
    const user = await User.findById(userId);
    user.cartItems = {};
    await user.save();

    // Return immediately — long-running tasks handled by background functions
    return NextResponse.json({ 
      success: true, 
      message: paymentMethod === 'cod' ? "Order Placed. Processing in background" : "Order created. Proceed to payment",
      orderId: orderData.orderId,
      courier: { courierName, courierTrackingNumber, courierStatus },
      paymentMethod
    });

  } catch (error) {
    console.error("❌ Order Error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
