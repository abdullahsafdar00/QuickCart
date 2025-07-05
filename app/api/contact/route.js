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

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_TO,
    subject: `New Contact Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
