import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AllProductsClient from "./AllProductsClient";

export default function AllProductsPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <AllProductsClient />
      </Suspense>
      <Footer />
    </>
  );
}
