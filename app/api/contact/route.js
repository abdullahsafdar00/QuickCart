import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import validator from "validator";

export async function POST(req) {
  const { name, email, message } = await req.json();

  if (!email || !validator.isEmail(email)) {
    return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email sent to YOU (site owner)
  const adminMailOptions = {
    from: email,
    to: process.env.EMAIL_TO,
    subject: `New Contact Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  // Email sent to the USER as confirmation
  const userMailOptions = {
    from: `"Your Company" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "We've received your message!",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Hi ${name || "there"},</h2>
        <p>Thank you for reaching out to us. We've received your message and our team will get back to you shortly.</p>
        <p><strong>Here’s what you sent us:</strong></p>
        <blockquote style="margin: 10px 0; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #ccc;">
          ${message}
        </blockquote>
        <br/>
        <p>Warm regards,<br/>HmElectronics</p>
        <hr/>
        <small>This is an automated confirmation. Please do not reply directly to this email.</small>
      </div>
    `,
  };

  try {
    // Send both emails
    await transporter.sendMail(adminMailOptions); // to YOU
    await transporter.sendMail(userMailOptions);  // to USER

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
