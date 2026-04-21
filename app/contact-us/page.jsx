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
              {status === "loading" ?   <span className="flex space-x-1">
    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
  </span> : "Send Message"}
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
                  hmelectronics.shop@gmail.com
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
          className="fixed bottom-6 right-6 p-4 rounded-full shadow-xl z-50 transition"
          aria-label="Chat on WhatsApp"
        >
            <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-6 h-6"
    role="img"
    fill="none"
    stroke="none"
  >
    <title>WhatsApp</title>
    <path
      fill="#25D366"
      d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.62-6.003C.122 5.3 5.495 0 12.057 0c3.2 0 6.217 1.246 8.477 3.507a11.821 11.821 0 013.498 8.414c-.003 6.562-5.377 11.935-11.94 11.935a11.9 11.9 0 01-5.606-1.426L.057 24z"
    />
    <path
      fill="#FFF"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.172.2-.296.298-.495.099-.198.05-.372-.025-.52-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.123-.272-.198-.57-.347z"
    />
  </svg>
        </a>
      </section>

      <Footer />
    </>
  );
};

export default ContactUs;
