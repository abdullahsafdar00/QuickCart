"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import validator from "validator";

const NewsLetter = () => {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = async (e) => {
  e.preventDefault();

    if (!validator.isEmail(email)) {
    setStatus("invalid");
    return;
  }

  setStatus("loading");

  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
    
      if (data.message === "Already subscribed") {
        setStatus("already");
      } else {
        setStatus("success");
        setTimeout(() => {
          router.push("/thank-you");
        }, 1500);
      }
      setEmail("");
    } else {
      setStatus("error");
    }
  } catch (err) {
    console.error(err);
    setStatus("error");
  }
};

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14">
      <h1 className="md:text-4xl text-2xl font-medium">
        Subscribe now & get 20% off
      </h1>
      <p className="md:text-base text-gray-500/80 pb-8">
        Sign up to get the latest deals, offers, and tech drops.
      </p>

      <form
        onSubmit={handleSubscribe}
        className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12"
      >
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email id"
          className="border border-gray-500/30 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-orange-600 rounded-md rounded-l-none"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {status === "success" && (
        <p className="text-green-600 pt-2">Thank you for subscribing!</p>

      )}

    {status === "already" && (
  <p className="text-yellow-600 pt-2">You're already subscribed!</p>
)}

{status === "invalid" && (
  <p className="text-red-600 pt-2">Please enter a valid email address.</p>
)}

      {status === "error" && (
        <p className="text-red-500 pt-2">Something went wrong. Try again.</p>
      )}
    </div>
  );
};

export default NewsLetter;
