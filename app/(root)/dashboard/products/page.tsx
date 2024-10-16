import { DataTableSkeleton } from "@/components/data-table-skeleton";
import { ProductsTable } from "@/components/products/table/product-table";
import { getProducts } from "@/lib/actions/product";
import { getProductsSchema } from "@/lib/validations/search-params";
import { TypeParams } from "@/types/params";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page({ searchParams }: TypeParams) {
  const company_ruc =
    typeof searchParams.ruc === "string" ? searchParams.ruc : "";
  if (!company_ruc) {
    redirect("/onboarding");
  }
  const search = getProductsSchema.parse(searchParams);
  const products = getProducts(search);
  return (
    <section>
      <Suspense fallback={<DataTableSkeleton columnCount={7} rowCount={10} />}>
        <ProductsTable productsPromise={products} />
      </Suspense>
    </section>
  );
}
