import { usePayment } from "@/context/sections/payments-context";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export function PaymentsDataTable() {
  const {
    currentPage,
    limit,
    setLimit,
    setCurrentPage,
    totalElements,
    totalPages,
    payments,
    loading,
  } = usePayment();
  return (
    <div className="mx-auto">
      <DataTable
        loading={loading}
        columns={columns}
        data={payments}
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
