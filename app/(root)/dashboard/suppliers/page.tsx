"use client";

import { LayerPage } from "@/components/layer-page";
import { SuppliersDataTable } from "@/components/suppliers/data-table";
import { SupplierProvider } from "@/context/sections/suppliers-context";

export default function Page() {
  return (
    <LayerPage title="Proveedores">
      <SupplierProvider>
        <SuppliersDataTable />
      </SupplierProvider>
    </LayerPage>
  );
}
