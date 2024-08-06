import { DataTable } from "@/components/ui/data-table-v2";
import { useSupplier } from "@/context/sections/suppliers-context";
import { columns } from "./columns";

export function SuppliersDataTable() {
  const {
    suppliers,
    page,
    perPage,
    setPage,
    setPerPage,
    totalPages,
    totalElements,
  } = useSupplier();
 
  return (
    <div className="mx-auto">
      <DataTable
        columns={columns}
        data={suppliers}
        rowsPerPage={perPage}
        currentPage={page}
        setPage={setPage}
        setRowsPerPage={setPerPage}
        pagesCount={totalPages}
        totalElements={totalElements}
      />
    </div>
  );
}
