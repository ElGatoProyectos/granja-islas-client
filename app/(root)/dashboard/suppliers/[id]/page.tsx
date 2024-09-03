"use client";

import { SupplierProductsDataTable } from "@/components/suppliers/table-product";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SupplierProductsProvider } from "@/context/sections/supplier-product-context";
import { useInfoSupplier } from "@/hooks/useInfoSupplier";

export default function Page() {
  const { supplier } = useInfoSupplier();
  return (
    <section>
      <Card className="mb-4">
        <CardHeader className="flex-row gap-8 space-y-0">
          <CardTitle className="max-w-32 font-bold flex justify-center">
            Detalles de proveedor
          </CardTitle>
          {supplier ? (
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
                  {supplier.country_code ? supplier.country_code : ""}{" "}
                  {supplier.phone}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-6 w-full flex-1">
              <div className="flex flex-col font-medium w-full gap-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-32 h-6" />
              </div>
              <div className="flex flex-col font-medium w-full gap-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-32 h-6" />
              </div>
              <div className="flex flex-col font-medium w-full gap-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-32 h-6" />
              </div>
              <div className="flex flex-col font-medium w-full gap-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-32 h-6" />
              </div>
              <div className="flex flex-col font-medium w-full gap-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-32 h-6" />
              </div>
              <div className="flex flex-col font-medium w-full gap-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-32 h-6" />
              </div>
            </div>
          )}
        </CardHeader>
      </Card>
      <SupplierProductsProvider>
        <SupplierProductsDataTable />
      </SupplierProductsProvider>
    </section>
  );
}
