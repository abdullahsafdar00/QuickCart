"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ContactUs = () => {
    const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ name: "", email: "", message: "" });
        setStatus("success");
        setTimeout(() => {
    router.push("/thank-you");
  }, 1500);
      } else throw new Error();
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-semibold text-center mb-8 text-orange-600">
        Contact Us
      </h2>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Your message..."
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition"
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && (
            <p className="text-green-600 text-sm">Message sent successfully!</p>
          )}
          {status === "invalid" && (
  <p className="text-red-600 pt-2">Please enter a valid email address.</p>
)}
          {status === "error" && (
            <p className="text-red-600 text-sm">Something went wrong. Try again.</p>
          )}
        </form>

        {/* Company Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Get in Touch</h3>
            <p className="text-gray-600">
              Have questions or need help? We're here for you.
            </p>
          </div>

          <div className="text-gray-700 space-y-2">
            <p>📧 Email: <a href="mailto:support@hmelectronics.pk" className="text-orange-600">support@hmelectronics.pk</a></p>
            <p>📞 Phone: <a href="tel:+923040505905" className="text-orange-600">+92 304-0505905</a></p>
            <p>📍 Address: HM Electronics, Faisalabad, Pakistan</p>
          </div>

          <div>
            <h4 className="font-medium mb-1">Business Hours</h4>
            <p>Monday – Sunday: 9 AM – 8 PM</p>
            <p>Friday: Closed</p>
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/923040505905"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="..." />
        </svg>
      </a>
    </div>
  );
};

export default ContactUs;
