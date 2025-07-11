import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "HMElectronics",
  description: "E-Commerce with Next.js ",
};


export default function RootLayout({ children }) {
  return (
    <ClerkProvider
  publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
  frontendApi={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}
>
  <html lang="en">
    <body className={`${outfit.className} antialiased text-gray-700`}>
      
      <Toaster />
      <AppContextProvider>
        {children}
      </AppContextProvider>
    </body>
  </html>
</ClerkProvider>

  );
}
