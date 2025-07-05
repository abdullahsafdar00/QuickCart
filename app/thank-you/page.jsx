import React from "react";
import Link from "next/link";

const ThankYouPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-semibold text-orange-600 mb-4">Thank You!</h1>
      <p className="text-gray-600 mb-6">
        We’ve received your message/subscription. You’ll hear from us soon!
      </p>
      <Link
        href="/"
        className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ThankYouPage;
