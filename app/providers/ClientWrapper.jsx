"use client"
import React from "react";
import ClientProviders from "./ClientProviders";
import { AppContextProvider } from "@/context/AppContext";

export default function ClientWrapper({ children }) {
  // This component intentionally runs only on the client and
  // composes all client-only providers (Clerk, AppContext, toasters, etc.)
  return (
    <ClientProviders>
      <AppContextProvider>
        {children}
      </AppContextProvider>
    </ClientProviders>
  );
}
