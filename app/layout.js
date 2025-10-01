import { Outfit } from "next/font/google";
import "./globals.css";
// AppContextProvider moved into ClientProviders to ensure the
// context and Clerk client are only loaded on the client.
import { Toaster } from "react-hot-toast";
import ClientLoader from "./providers/ClientLoader";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "HM Electronics",
  description: "HM Electronics is a well updated online shopping in Pakistan. HmElectronics offers a variety of electric products such as Kitchen Appliances, Irons and heaters, Hairs dryers and straightners, trimmers, hair products, and more",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <Toaster />
        <ClientLoader>
          {children}
        </ClientLoader>
      </body>
    </html>
  );
}
