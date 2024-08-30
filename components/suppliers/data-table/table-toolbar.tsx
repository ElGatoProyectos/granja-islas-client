"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { Download, X } from "lucide-react";

import { states } from "./supplier-filters";
import { SupplierForm } from "../supplier-form";
import { useSupplier } from "@/context/sections/suppliers-context";
import { DataTableViewOptions } from "@/components/ui-custom/table-view-options";
import { transformData, translateString } from "@/utils/change-name";
import { ViewToggle } from "../viewtoggle";
import { DataTableFacetedFilter } from "@/components/ui-custom/table-faceted-filter";
import { exportToExcel } from "@/utils/export-excel";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const {
    loadingSuppliers,
    search,
    setSearch,
    getSuppliers,
    setStatusSupp,
    exportExcel,
    setPage,
    syncSuppliersData,
  } = useSupplier();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar razón social o RUC"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="w-[150px] lg:w-[250px]"
        />
        <ViewToggle />
        {table.getColumn("business_status") && (
          <DataTableFacetedFilter
            column={table.getColumn("business_status")}
            title="Estado"
            options={states}
            setFilter={setStatusSupp}
            setCurrentPage={setPage}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="px-2 lg:px-3 "
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          type="button"
          disabled={loadingSuppliers}
          onClick={async () => {
            const suppliers = await exportExcel();
            exportToExcel({
              data: transformData(suppliers, translateString),
              filename: "proveedores",
            });
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Excel
        </Button>
        <SupplierForm type="create" getSuppliers={getSuppliers} />
        <Button
          type="button"
          variant="secondary"
          onClick={syncSuppliersData}
          disabled={loadingSuppliers}
        >
          Actualizar Datos
        </Button>
        <DataTableViewOptions changeTitle={translateString} table={table} />
      </div>
    </div>
  );
}
