"use client";

import { ProductDetails } from "@/components/products/product-details";
import { ProductDetailsProvider } from "@/context/sections/product-details";

export default function Page() {
  return (
    <ProductDetailsProvider>
      <ProductDetails />
    </ProductDetailsProvider>
  );
}
