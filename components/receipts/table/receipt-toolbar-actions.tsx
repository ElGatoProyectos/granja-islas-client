"use client";

import { Button } from "@/components/ui/button";
import { getReceiptsForExcel } from "@/lib/actions/receipt";
import { getReceiptsSchema } from "@/lib/validations/search-params";
import { TypeReceipt } from "@/types/receipt";
import { receiptViewTable, transformData } from "@/utils/change-name";
import { exportToExcel2 } from "@/utils/export-excel";
import { formatDate } from "@/utils/format-date";
import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ReceiptsTableToolbarActionsProps {
  table: Table<TypeReceipt>;
}

export function ReceiptsTableToolbarActions({
  table,
}: ReceiptsTableToolbarActionsProps) {
  const [isLoading, setisLoading] = useState(false);
  const searchParams = useSearchParams();

  return (
    <div className="flex items-center gap-2">
      {/* {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteTasksDialog
          tasks={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null} */}

      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={async () => {
          try {
            setisLoading(true);
            const paramsObject = Object.fromEntries(searchParams.entries());
            const search = getReceiptsSchema.safeParse(paramsObject);
            if (search.success) {
              const receiptsData = await getReceiptsForExcel(search.data);
              const currentDate = formatDate(new Date());
              exportToExcel2({
                data: transformData(receiptsData, receiptViewTable),
                filename: `Comprobantes ${currentDate}`,
                columnOrder: [
                  "Serie",
                  "Nro.",
                  "Tipo de documento",
                  "Proveedor",
                  "RUC",
                  "Emisión",
                  "Moneda",
                  "Monto",
                  "IGV",
                  "%IGV",
                  "Importe Total",
                  "Tipo de pago",
                  "Estado",
                ],
              });
            }
          } catch (e) {
            toast.error("Ocurrió un error al descargar el excel");
          } finally {
            setisLoading(false);
          }
        }}
      >
        <Download className="size-4 mr-2" />
        Excel
      </Button>
    </div>
  );
}
