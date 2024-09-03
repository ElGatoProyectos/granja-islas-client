"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { Download, X } from "lucide-react";
import { DataTableViewOptions } from "@/components/ui-custom/table-view-options";
import { useReceipt } from "@/context/sections/receipts-context";
import { receiptViewTable, transformData } from "@/utils/change-name";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DatePicker } from "@/components/date-picker";
import { exportToExcel } from "@/utils/export-excel";
import { arrayOfTypesDocument } from "@/constants/type-document";
import { DataTableFacetedFilter } from "@/components/ui-custom/table-faceted-filter";
import { useUserInfo } from "@/context/user-context";
import { ADMIN, SUPERADMIN } from "@/constants/roles";

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
    getReceipts,
    loading,
    exportExcel,
    setIdsTypeDocument,
    setCurrentPage,
  } = useReceipt();

  const options = supplierFilter.map(({ id, business_name }) => ({
    value: id.toString(),
    label: business_name.toLowerCase(),
  }));

  const { userInfo } = useUserInfo();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar por número"
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
          getData={getReceipts}
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
        {table.getColumn("document_description") && (
          <DataTableFacetedFilter
            column={table.getColumn("document_description")}
            title="Tipo de documento"
            options={arrayOfTypesDocument}
            setFilter={setIdsTypeDocument}
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
        {userInfo?.role === SUPERADMIN || userInfo?.role === ADMIN ? (
          <>
            <Button
              variant="outline"
              type="button"
              disabled={loading}
              onClick={async () => {
                const products = await exportExcel();
                const currentDate = new Date().toISOString().split("T")[0];
                exportToExcel({
                  data: transformData(products, receiptViewTable),
                  filename: `Comprobantes ${currentDate}`,
                });
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Link href={`${pathname}/create`} className={buttonVariants()}>
              Agregar comprobante
            </Link>
          </>
        ) : null}

        <DataTableViewOptions table={table} changeTitle={receiptViewTable} />
      </div>
    </div>
  );
}
