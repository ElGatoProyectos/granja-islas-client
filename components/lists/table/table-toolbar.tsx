"use client";

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { Download, X } from "lucide-react";
import { DataTableViewOptions } from "@/components/ui-custom/table-view-options";
import { listViewTable, transformData } from "@/utils/change-name";
import { DatePicker } from "@/components/date-picker";
import { useList } from "@/context/sections/lists-context";
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
    getLists,
    exportExcel,
    loading,
    setCurrentPage,
  } = useList();

  const options = supplierFilter.map(({ id, business_name }) => ({
    value: id.toString(),
    label: business_name.toLowerCase(),
  }));

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar por etiqueta"
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
          getData={getLists}
          title="Fecha"
        />
        {table.getColumn("business_name") && (
          <DataTableFacetedFilter
            column={table.getColumn("business_name")}
            title="Proveedores"
            options={options}
            setFilter={setIdSupplier}
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
            const products = await exportExcel();
            exportToExcel({
              data: transformData(products, listViewTable),
              filename: "lista-de-etiquetas",
            });
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Excel
        </Button>
        <DataTableViewOptions table={table} changeTitle={listViewTable} />
      </div>
    </div>
  );
}
