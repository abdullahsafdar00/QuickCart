// app/api/subscribe/route.js
import nodemailer from "nodemailer";
import Newsletter from "@/models/newsletter"; 
import connectDB from "@/config/db";
import validator from "validator";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    if (!email || !validator.isEmail(email)) {
  return Response.json({ error: "Invalid email address" }, { status: 400 });
}



    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ message: "Invalid email" }), {
        status: 400,
      });
    }

    await connectDB();

    // Save to MongoDB (Newsletter Collection)
    const existing = await Newsletter.findOne({ email });

     if (existing) {
      return new Response(JSON.stringify({ message: "Already subscribed" }), { status: 200 });
    }

    if (!existing) {
      await Newsletter.create({ email });
    }

    

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 1️⃣ Notify Site Owner
    await transporter.sendMail({
      from: `"Newsletter Signup" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "New Newsletter Subscriber",
      text: `New subscriber: ${email}`,
      html: `<p>New subscriber: <strong>${email}</strong></p>`,
    });

    // 2️⃣ Send Welcome Email to User
    await transporter.sendMail({
      from: `"HM Electronics" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to HM Electronics 🎉",
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>Welcome to HM Electronics!</h2>
          <p>Thanks for subscribing. You're now part of our exclusive community.</p>
          <p>Stay tuned for exciting deals, latest tech drops, and exclusive discounts just for you!</p>
          <p>— Team HM Electronics</p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
