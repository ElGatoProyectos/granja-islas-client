import { useList } from "@/context/sections/lists-context";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export function ListsDataTable() {
  const {
    lists,
    currentPage,
    limit,
    setLimit,
    setCurrentPage,
    totalElements,
    totalPages,
  } = useList();

  return (
    <div className="mx-auto">
      <DataTable
        columns={columns}
        data={lists}
        limit={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalElements={totalElements}
      />
    </div>
  );
}
