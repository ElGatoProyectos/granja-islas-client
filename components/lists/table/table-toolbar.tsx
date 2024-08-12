"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { Download, X } from "lucide-react";
import { DataTableViewOptions } from "@/components/ui-custom/table-view-options";
import { listViewTable } from "@/utils/change-name";
import { usePathname } from "next/navigation";
import { DatePicker } from "@/components/date-picker";
import { useList } from "@/context/sections/lists-context";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const pathname = usePathname();
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
  } = useList();

  const options = supplierFilter.map(({ id, business_name }) => ({
    value: id.toString(),
    label: business_name.toLowerCase(),
  }));

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* <Input
          placeholder="Buscar por número"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-[150px] lg:w-[250px]"
        /> */}
        <DatePicker
          setMonth={setMonth}
          setYear={setYear}
          year={year}
          month={month}
          getData={getLists}
        />
        {/* {table.getColumn("business_name") && (
          <DataTableFacetedFilter
            column={table.getColumn("business_name")}
            title="Proveedores"
            options={options}
            setFilter={setIdSupplier}
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
        )} */}
      </div>
      <div className="flex space-x-2">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Excel
        </Button>
        {/* <Link href={`${pathname}/create`} className={buttonVariants()}>
          Agregar comprobante
        </Link> */}
        <DataTableViewOptions table={table} changeTitle={listViewTable} />
      </div>
    </div>
  );
}
