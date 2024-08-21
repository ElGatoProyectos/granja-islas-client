"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { Download, X } from "lucide-react";
import { DataTableViewOptions } from "@/components/ui-custom/table-view-options";
import {
  productsViewTable,
  receiptViewTable,
  transformData,
} from "@/utils/change-name";
import { usePathname } from "next/navigation";
import { DatePicker } from "@/components/date-picker";
import { useProduct } from "@/context/sections/products-context";
import { Input } from "@/components/ui/input";
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
    setSearch,
    search,
    supplierFilter,
    setIdSupplier,
    setMonth,
    setYear,
    year,
    month,
    getProducts,
    setIdLabel,
    labelFilter,
    exportExcel,
    loading,
  } = useProduct();

  const options = supplierFilter.map(({ id, business_name }) => ({
    value: id.toString(),
    label: business_name.toLowerCase(),
  }));

  const options2 = labelFilter.map(({ id, title }) => ({
    value: id.toString(),
    label: title.toLowerCase(),
  }));

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar producto"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-[150px] lg:w-[250px]"
        />
        <DatePicker
          setMonth={setMonth}
          setYear={setYear}
          year={year}
          month={month}
          getData={getProducts}
        />
        {table.getColumn("business_name") && (
          <DataTableFacetedFilter
            column={table.getColumn("business_name")}
            title="Proveedores"
            options={options}
            setFilter={setIdSupplier}
          />
        )}
        {table.getColumn("title") && (
          <DataTableFacetedFilter
            column={table.getColumn("title")}
            title="Etiquetas"
            options={options2}
            setFilter={setIdLabel}
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
            const products = await exportExcel();
            exportToExcel({
              data: transformData(products, productsViewTable),
              filename: "productos",
            });
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Excel
        </Button>
        <DataTableViewOptions table={table} changeTitle={productsViewTable} />
      </div>
    </div>
  );
}
