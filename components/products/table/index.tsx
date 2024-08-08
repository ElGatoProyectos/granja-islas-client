import { useProduct } from "@/context/sections/products-context";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export function ProductsDataTable() {
  const {
    products,
    currentPage,
    limit,
    setLimit,
    setCurrentPage,
    totalElements,
    totalPages,
  } = useProduct();
  return (
    <div className="mx-auto">
      <DataTable
        columns={columns}
        data={products}
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
