import { DataTableSkeleton } from "@/components/data-table-skeleton";
import { ProductsOfSupplierTable } from "@/components/suppliers/table-product/supplier-products-table.tsx";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getProductsOfSupplier,
  getSupplier,
} from "@/lib/actions/supplier.actions";
import { getProductsOfSuppliersSchema } from "@/lib/validations/search-params";
import { TypeParams } from "@/types/params";
import { redirect } from "next/navigation";
import { Suspense } from "react";

function SupplierDetailsSkeleton() {
  return (
    <div className="flex gap-6 w-full flex-1">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="flex flex-col font-medium w-full gap-2">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-32 h-6" />
        </div>
      ))}
    </div>
  );
}

async function SupplierDetails({ id, ruc }: { id: string; ruc: string }) {
  const supplier = await getSupplier({ id, ruc });

  if (!supplier) {
    return <SupplierDetailsSkeleton />;
  }

  return (
    <div className="flex gap-6 w-full flex-1 text-sm text-muted-foreground">
      <div className="flex flex-col font-medium w-full">
        <span>Razón social</span>
        <p className="text-foreground capitalize">
          {supplier.business_name.toLowerCase()}
        </p>
      </div>
      <div className="flex flex-col font-medium w-full">
        <span>RUC</span>
        <p className="text-foreground">{supplier.ruc}</p>
      </div>
      <div className="flex flex-col font-medium w-full">
        <span>Tipo</span>
        <p className="text-foreground">{supplier.business_type}</p>
      </div>
      <div className="flex flex-col font-medium w-full">
        <span>Estado</span>
        <p className="text-foreground">{supplier.business_status}</p>
      </div>
      <div className="flex flex-col font-medium w-full">
        <span>Dirección Fiscal</span>
        <p className="text-foreground capitalize line-clamp-1">
          {supplier.business_direction.toLowerCase()}
        </p>
      </div>
      <div className="flex flex-col font-medium w-full">
        <span>Celular</span>
        <p className="text-foreground">
          {supplier.country_code ? supplier.country_code : ""} {supplier.phone}
        </p>
      </div>
    </div>
  );
}

export default async function Page({ params, searchParams }: TypeParams) {
  const company_ruc =
    typeof searchParams.ruc === "string" ? searchParams.ruc : "";

  if (!company_ruc) {
    redirect("/onboarding");
  }
  const search = getProductsOfSuppliersSchema.parse({
    ...searchParams,
    id_supplier: params.id,
  });
  const productsOfSupplier = getProductsOfSupplier(search);
  return (
    <section>
      <Card className="mb-4">
        <CardHeader className="flex-row gap-8 space-y-0">
          <CardTitle className="max-w-32 font-bold flex justify-center">
            Detalles de proveedor
          </CardTitle>
          <Suspense fallback={<SupplierDetailsSkeleton />}>
            <SupplierDetails id={params.id} ruc={company_ruc} />
          </Suspense>
        </CardHeader>
      </Card>
      <Suspense fallback={<DataTableSkeleton columnCount={7} rowCount={10} />}>
        <ProductsOfSupplierTable
          productsOfSupplierPromise={productsOfSupplier}
        />
      </Suspense>
    </section>
  );
}
