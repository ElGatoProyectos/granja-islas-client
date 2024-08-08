import { useReceipt } from "@/context/sections/receipts-context";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export function ReceiptsDataTable() {
  const {
    receipts,
    currentPage,
    limit,
    setLimit,
    setCurrentPage,
    totalElements,
    totalPages,
  } = useReceipt();
  return (
    <div className="mx-auto">
      <DataTable
        columns={columns}
        data={receipts}
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
