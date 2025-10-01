"use client"
import React from "react";
import ClientProviders from "./ClientProviders";

export default function ClientLoader({ children }) {
  // This file is a thin client wrapper so the server layout can import
  // a client component without attempting any dynamic ssr:false calls.
  return <ClientProviders>{children}</ClientProviders>;
}
