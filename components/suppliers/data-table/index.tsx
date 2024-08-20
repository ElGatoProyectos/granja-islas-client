import { DataTable } from "@/components/ui/data-table-v2";
import { useSupplier } from "@/context/sections/suppliers-context";
import { columns } from "./columns";
import { Tabs } from "@/components/ui/tabs";

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
    <Tabs defaultValue="table" className="w-full">
      <div className="mx-auto">
        <DataTable
          columns={columns}
          suppliers={suppliers}
          data={suppliers}
          rowsPerPage={perPage}
          currentPage={page}
          setPage={setPage}
          setRowsPerPage={setPerPage}
          pagesCount={totalPages}
          totalElements={totalElements}
        />
      </div>
    </Tabs>
  );
}
