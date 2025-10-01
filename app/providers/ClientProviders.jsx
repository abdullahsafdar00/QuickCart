"use client"
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";

export default function ClientProviders({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      frontendApi={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}
    >
      <AppContextProvider>
        {children}
      </AppContextProvider>
    </ClerkProvider>
  );
}
