"use client";

import { LayerPage } from "@/components/layer-page";
import { columns } from "@/components/suppliers/data-table/columns";
import { DataTable } from "@/components/ui/data-table-v2";
import { useSuppliers } from "@/hooks/useSuppliers";

export default function Page() {
  const {
    suppliers,
    page,
    perPage,
    setPage,
    setPerPage,
    totalPages,
    getSuppliers,
    totalElements,
  } = useSuppliers();

  return (
    <LayerPage title="Proveedores">
      <div className="mx-auto">
        <DataTable
          columns={columns}
          data={suppliers}
          rowsPerPage={perPage}
          currentPage={page}
          setPage={setPage}
          setRowsPerPage={setPerPage}
          pagesCount={totalPages}
          getData={getSuppliers}
          totalElements={totalElements}
        />
      </div>
    </LayerPage>
  );
}
