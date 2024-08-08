"use client";

import { ProductsDataTable } from "@/components/products/table";
import { ProductProvider } from "@/context/sections/products-context";

export default function Page() {
  return (
    <section>
      <ProductProvider>
        <ProductsDataTable />
      </ProductProvider>
    </section>
  );
}
