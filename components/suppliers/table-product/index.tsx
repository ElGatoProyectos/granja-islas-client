import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useSupplierProducts } from "@/context/sections/supplier-product-context";

export function SupplierProductsDataTable() {
  const {
    productsOfSupplier,
    limit,
    setLimit,
    currentPage,
    setCurrentPage,
    totalPages,
    totalElements,
  } = useSupplierProducts();
  return (
    <div className="mx-auto">
      <DataTable
        columns={columns}
        data={productsOfSupplier}
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
