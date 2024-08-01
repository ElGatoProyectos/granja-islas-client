"use client";

import { LayerPage } from "@/components/layer-page";
import { columns } from "@/components/suppliers/data-table/columns";
import { SupplierForm } from "@/components/suppliers/supplier-form";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useCompanySession } from "@/context/company-context";
import { useSuppliers } from "@/hooks/useSuppliers";

export default function Page() {
  const { company } = useCompanySession();
  const { suppliers, loadingSuppliers, getSuppliers } = useSuppliers({
    ruc: company?.ruc,
  });
  console.log("data page ->", suppliers);
  console.log("loadingSuppliers ->", loadingSuppliers);

  return (
    <LayerPage title="Proveedores">
      <Button onClick={getSuppliers}>GetSuuplier</Button>
      <SupplierForm type="create" />
      {suppliers.map(({ id, ruc }) => (
        <div key={id}>{ruc}</div>
      ))}
      <div className="mx-auto">
        {/* {loadingSuppliers ? (
          <div>cargadno</div>
        ) : suppliers.length ? (
          <DataTable columns={columns} data={suppliers} />
        ) : (
          "no hay datos"
        )} */}
      </div>
    </LayerPage>
  );
}
