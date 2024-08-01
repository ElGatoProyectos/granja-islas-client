"use client";

import { LayerPage } from "@/components/layer-page";
import { columns } from "@/components/suppliers/data-table/columns";
import { DataTable } from "@/components/ui/data-table";
import { useSupplier } from "@/context/supplier-context";

export default function Page() {
  const { suppliers, loadingSuppliers } = useSupplier();

  return (
    <LayerPage title="Proveedores">
      <div className="mx-auto">
        {loadingSuppliers ? (
          <div>cargadno</div>
        ) : suppliers.length ? (
          <DataTable columns={columns} data={suppliers} />
        ) : (
          "no hay datos"
        )}
      </div>
    </LayerPage>
  );
}
