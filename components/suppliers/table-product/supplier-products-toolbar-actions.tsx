"use client";

import { Button } from "@/components/ui/button";
import { getProductsOfSupplierForExcel } from "@/lib/actions/supplier.actions";
import { searchParamsProductsOfSuppliersSchema } from "@/lib/validations/search-params";
import { TypeProductsOfSupplierTable } from "@/types/supplier";
import { productsViewTable, transformData } from "@/utils/change-name";
import { exportToExcel } from "@/utils/export-excel";
import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ProductsOfSupplierTableToolbarActionsProps {
  table: Table<TypeProductsOfSupplierTable>;
}

export function ProductsOfSupplierTableToolbarActions({
  table,
}: ProductsOfSupplierTableToolbarActionsProps) {
  const [isLoading, setisLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleExportExcel = async () => {
    setisLoading(true);
    const paramsObject = Object.fromEntries(searchParams.entries());
    const search =
      searchParamsProductsOfSuppliersSchema.safeParse(paramsObject);
    try {
      if (search.success) {
        const productsOfSuppliers = await getProductsOfSupplierForExcel(
          search.data
        );
        exportToExcel({
          data: transformData(productsOfSuppliers, productsViewTable),
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
