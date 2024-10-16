"use client";

import { Button } from "@/components/ui/button";
import { getProductsForExcel } from "@/lib/actions/product";
import { getReceiptsSchema } from "@/lib/validations/search-params";
import { TypeProductTableFormat } from "@/types/product";
import { productsViewTable, transformData } from "@/utils/change-name";
import { exportToExcel } from "@/utils/export-excel";
import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ProductsTableToolbarActionsProps {
  table: Table<TypeProductTableFormat>;
}

export function ReceiptsTableToolbarActions({
  table,
}: ProductsTableToolbarActionsProps) {
  const [isLoading, setisLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleExportExcel = async () => {
    setisLoading(true);
    const paramsObject = Object.fromEntries(searchParams.entries());
    const search = getReceiptsSchema.safeParse(paramsObject);
    try {
      if (search.success) {
        const products = await getProductsForExcel(search.data);
        exportToExcel({
          data: transformData(products, productsViewTable),
          filename: "productos",
        });
      }
    } catch (e) {
      toast.error("Ocurrió un error al descargar el excel");
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleExportExcel}
      >
        <Download className="h-4 w-4 mr-2" />
        Excel
      </Button>
    </div>
  );
}
