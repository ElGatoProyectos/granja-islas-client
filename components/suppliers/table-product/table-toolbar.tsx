"use client";

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { Download, X } from "lucide-react";
import { DataTableViewOptions } from "@/components/ui-custom/table-view-options";
import {
  productsOfSupplierViewTable,
  transformData,
} from "@/utils/change-name";
import { DatePicker } from "@/components/date-picker";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/ui-custom/table-faceted-filter";
import { useSupplierProducts } from "@/context/sections/supplier-product-context";
import { exportToExcel } from "@/utils/export-excel";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const {
    setSearch,
    search,
    getProductsOfSupplier,
    setMonth,
    setYear,
    year,
    month,
    labelsFilters,
    setLabelId,
    exportExcel,
    loading,
    setCurrentPage,
  } = useSupplierProducts();

  const options = labelsFilters.map(({ id, title }) => ({
    value: id.toString(),
    label: title.toLowerCase(),
  }));

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar producto"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
          className="w-[150px] lg:w-[250px]"
        />
        <DatePicker
          setMonth={setMonth}
          setYear={setYear}
          year={year}
          month={month}
          getData={getProductsOfSupplier}
          title="Fecha"
        />
        {table.getColumn("labels") && (
          <DataTableFacetedFilter
            column={table.getColumn("labels")}
            title="Etiquetas"
            options={options}
            setFilter={setLabelId}
            setCurrentPage={setCurrentPage}
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
          disabled={loading}
          onClick={async () => {
            const productsOfSuppliers = await exportExcel();
            exportToExcel({
              data: transformData(
                productsOfSuppliers,
                productsOfSupplierViewTable
              ),
              filename: "Productos del proveedor",
            });
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Excel
        </Button>
        <DataTableViewOptions
          table={table}
          changeTitle={productsOfSupplierViewTable}
        />
      </div>
    </div>
  );
}
