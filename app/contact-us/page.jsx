"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

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
    <>
      <Navbar />

      <section className="relative bg-white py-16 px-4 md:px-20">
        {/* Gradient blur background */}
        <div className="absolute -top-20 left-0 w-[400px] h-[400px] bg-orange-100 opacity-30 rounded-full blur-[120px] -z-10" />
        <div className="absolute -bottom-16 right-0 w-[400px] h-[400px] bg-orange-200 opacity-40 rounded-full blur-[100px] -z-10" />

        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-orange-600 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Contact Us
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Form Section */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {["name", "email", "message"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700 mb-1 capitalize"
                >
                  {field === "message" ? "Your Message" : `Your ${field}`}
                </label>
                {field === "message" ? (
                  <textarea
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    rows={5}
                    required
                    placeholder="Type your message here..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    required
                    placeholder={
                      field === "email" ? "you@example.com" : "Your full name"
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition w-full md:w-auto"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <p className="text-green-600 text-sm">Message sent successfully!</p>
            )}
            {status === "error" && (
              <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
            )}
          </motion.form>

          {/* Info Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">Get in Touch</h3>
              <p className="text-gray-600">
                Have questions or need help? Our team is just a message away.
              </p>
            </div>

            <div className="text-gray-700 space-y-2">
              <p>
                📧 Email:{" "}
                <a href="mailto:support@hmelectronics.pk" className="text-orange-600">
                  support@hmelectronics.pk
                </a>
              </p>
              <p>
                📞 Phone:{" "}
                <a href="tel:+923040505905" className="text-orange-600">
                  +92 304-0505905
                </a>
              </p>
              <p>📍 Address: HM Electronics, Faisalabad, Pakistan</p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Business Hours</h4>
              <p>Monday – Sunday: 9 AM – 8 PM</p>
              <p>Friday: Closed</p>
            </div>
          </motion.div>
        </div>

        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/923040505905"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl z-50 transition"
          aria-label="Chat on WhatsApp"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.15 1.61 5.96L0 24l6.28-1.65a11.94 11.94 0 005.72 1.46c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 21.75a9.76 9.76 0 01-4.94-1.35l-.35-.2-3.73.99 1-3.65-.23-.38a9.76 9.76 0 0115.5-11.42A9.76 9.76 0 0121.75 12c0 5.37-4.38 9.75-9.75 9.75zm5.4-7.95c-.3-.15-1.76-.86-2.03-.96s-.47-.15-.67.15c-.2.3-.76.96-.93 1.16-.17.2-.35.23-.65.08s-1.27-.47-2.42-1.5a9.18 9.18 0 01-1.7-2.12c-.18-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38 0-.53-.05-.15-.66-1.6-.9-2.2-.24-.6-.5-.52-.67-.53H8.1c-.15 0-.4.06-.6.3s-.8.78-.8 1.9.82 2.2.93 2.35c.12.15 1.6 2.5 3.88 3.5 2.28 1 2.28.67 2.7.63.43-.04 1.4-.57 1.6-1.12.2-.56.2-1.04.15-1.15-.05-.1-.25-.16-.55-.3z" />
          </svg>
        </a>
      </section>

      <Footer />
    </>
  );
};

export default ContactUs;
