"use client";

import { PeriodsRange } from "@/components/periods-range";
import { DataTableFacetedFilter } from "@/components/ui-custom/table-faceted-filter";
import { DataTableViewOptions } from "@/components/ui-custom/table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ADMIN, SUPERADMIN } from "@/constants/roles";
import { START_MONTH_SYNC, START_YEAR_SYNC } from "@/constants/start-sync";
import { arrayOfTypesDocument } from "@/constants/type-document";
import { useReceipt } from "@/context/sections/receipts-context";
import { useUserInfo } from "@/context/user-context";
import { receiptViewTable, transformData } from "@/utils/change-name";
import { exportToExcel2 } from "@/utils/export-excel";
import { Table } from "@tanstack/react-table";
import { Download, X } from "lucide-react";
import { usePathname } from "next/navigation";

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
    <section className="flex flex-col space-y-3">
      <div className="flex space-x-2">
        <Input
          placeholder="Buscar por serie o número"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
          className="w-[150px] lg:w-[450px]"
        />
        <div className="flex gap-2 items-center">
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
      </div>

      <div className="flex items-center justify-between ">
        <PeriodsRange
          monthStarted={START_MONTH_SYNC}
          yearStarted={START_YEAR_SYNC}
          currentDate
        />
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
              {/* <Link href={`${pathname}/create`} className={buttonVariants()}>
                Agregar comprobante
              </Link> */}
            </>
          ) : null}
          <DataTableViewOptions table={table} changeTitle={receiptViewTable} />
        </div>
      </div>
    </section>
  );
}
