import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useLabelDocuments } from "@/context/sections/document-label-context";

export function ReceiptsOfLabel() {
  const {
    limit,
    setLimit,
    currentPage,
    setCurrentPage,
    totalPages,
    totalElements,
    documents,
  } = useLabelDocuments();
  return (
    <div className="mx-auto mt-4">
      <DataTable
        columns={columns}
        data={documents}
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
