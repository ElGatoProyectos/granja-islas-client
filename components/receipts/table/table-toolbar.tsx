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
import { exportToExcel2 } from "@/utils/export-excel";
import { arrayOfTypesDocument } from "@/constants/type-document";
import { DataTableFacetedFilter } from "@/components/ui-custom/table-faceted-filter";
import { useUserInfo } from "@/context/user-context";
import { ADMIN, SUPERADMIN } from "@/constants/roles";
import { DatePickerNumber } from "@/components/date-picker-number";
import { useToast } from "@/components/ui/use-toast";

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
    loading,
    exportExcel,
    setIdsTypeDocument,
    setCurrentPage,
    setTypesPayment,

    selectedMonth,
    selectedYear,
    availableYears,
    getAvailableMonths,
    setSelectedMonth,
    setSelectedYear,
  } = useReceipt();

  const { toast } = useToast();

  const options = supplierFilter.map(({ id, business_name }) => ({
    value: id.toString(),
    label: business_name.toLowerCase(),
  }));

  const typesOfPayments = [
    { value: "CONTADO", label: "Contado" },
    { value: "CREDITO", label: "Credito" },
  ];

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
        <DatePickerNumber
          setSelectedMonth={setSelectedMonth}
          setSelectedYear={setSelectedYear}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          availableYears={availableYears}
          getAvailableMonths={getAvailableMonths}
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
        {table.getColumn("bill_status_payment") && (
          <DataTableFacetedFilter
            column={table.getColumn("bill_status_payment")}
            title="Tipo de pago"
            options={typesOfPayments}
            setFilter={setTypesPayment}
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
                try {
                  const products = await exportExcel();
                  const currentDate = new Date().toISOString().split("T")[0];
                  exportToExcel2({
                    data: transformData(products, receiptViewTable),
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
                } catch (e) {
                  toast({
                    variant: "destructive",
                    title: `Ocurrio un error al descargar el pdf, intente otra vez.`,
                  });
                }
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
