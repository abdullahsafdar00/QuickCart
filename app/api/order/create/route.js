import { inngest } from "@/config/inngest";
import Product from "@/models/product";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || items.length === 0) {
      return NextResponse.json({ success: false, message: "No items in the order" });
    }

    // 1️⃣ Calculate total
    let amount = 0;
    const itemDetails = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      amount += product.offerPrice * item.quantity;

      itemDetails.push({
        name: product.name,
        price: `PKR${product.offerPrice}`,
        quantity: item.quantity,
      });
    }

    const totalAmount = amount + Math.floor(amount * 0.02); // add 2% fee

    // 2️⃣ Fire Inngest event
    await inngest.send({
      name: 'order/created',
      data: {
        userId,
        address,
        items,
        amount: totalAmount,
        date: Date.now(),
      }
    });

    // 3️⃣ Clear cart
    const user = await User.findById(userId);
    user.cartItems = {};
    await user.save();

    // 4️⃣ Send Emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsHtml = itemDetails.map(
      (item) => `<li>${item.name} - ${item.quantity} × ${item.price}</li>`
    ).join("");

    const orderDetailsHtml = `
      <h2>🧾 Order Summary</h2>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Total:</strong> ₹${totalAmount}</p>
      <p><strong>Shipping:</strong> ${address}</p>
      <ul>${itemsHtml}</ul>
    `;

    // Email to Admin
    await transporter.sendMail({
      from: `"HM Electronics Order" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "📦 New Order Received",
      html: orderDetailsHtml,
    });

    // Email to Customer
    await transporter.sendMail({
      from: `"HM Electronics" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "✅ Your Order Confirmation",
      text: 'Order summary for your purchase from HM Electronics...',
      html: `
        <h2>Thank you for your order!</h2>
        <p>Your order has been placed successfully.</p>
        ${orderDetailsHtml}
        <p>We’ll ship your items soon!</p>
      `,
    });

    // ✅ Final response after email
    return NextResponse.json({ success: true, message: "Order Placed & Emails Sent" });

  } catch (error) {
    console.error("❌ Order Error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
