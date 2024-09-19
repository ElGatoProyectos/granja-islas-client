import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import { FormatedTotalAmountReceipts } from "@/hooks/useDashboard";
import { formatWithCommas } from "@/utils/format-number-comas";
import { DataTableSkeletonTest } from "./table-skeleton";
import Link from "next/link";
import { Download } from "lucide-react";
import { exportToExcel } from "@/utils/export-excel";
import { homeViewTable, transformData } from "@/utils/change-name";
import { useDatesFilter } from "@/context/dates-filter-context";

interface Props {
  receipts: FormatedTotalAmountReceipts[];
  loading: boolean;
  totalAmountofAll: number;
}

export function ShoppingRecordTable({
  receipts,
  loading,
  totalAmountofAll,
}: Props) {
  const {
    availableYears,
    getAvailableMonths,
    selectedYear,
    selectedMonth,
    setSelectedMonth,
    setSelectedYear,
  } = useDatesFilter();

  return (
    <main className="flex flex-col">
      <div className="flex justify-between">
        <form className="flex items-center gap-x-2 mb-4">
          <span className="text-sm ml-4 font-semibold">Periodo</span>
          <Select
            name="year"
            value={
              selectedYear.toString() === "0" ? "" : selectedYear.toString()
            }
            onValueChange={(value: string) =>
              setSelectedYear(parseInt(value, 10))
            }
          >
            <SelectTrigger className="w-[230px]">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Año</SelectLabel>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            name="month"
            value={
              selectedMonth.toString() === "0" ? "" : selectedMonth.toString()
            }
            onValueChange={(value: string) =>
              setSelectedMonth(parseInt(value, 10))
            }
          >
            <SelectTrigger className="w-[230px]">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Mes</SelectLabel>
                {getAvailableMonths(selectedYear).map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </form>
        <Button
          variant="outline"
          type="button"
          disabled={loading}
          onClick={async () => {
            exportToExcel({
              data: transformData(receipts, homeViewTable),
              filename: "Registro de compras",
            });
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Excel
        </Button>
      </div>
      {loading ? (
        <DataTableSkeletonTest
          columnCount={7}
          rowCount={5}
          withPagination={false}
          shrinkZero
          showViewOptions={false}
        />
      ) : (
        <Table>
          <TableCaption>
            Si los datos no se muestran, puede sincronizarlos con SUNAT
            utilizando el siguiente
            <Link
              href="/dashboard/settings"
              className={`${buttonVariants({ variant: "link" })} !p-0 ml-1`}
            >
              enlace.
            </Link>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo de documento</TableHead>
              <TableHead>Total de documentos</TableHead>
              <TableHead className="text-right">BI Gravado DG</TableHead>
              <TableHead className="text-right">IGV/IPM DG</TableHead>
              <TableHead className="text-right">BI Gravado DGNG</TableHead>
              <TableHead className="text-right">IGV/IPM DGNG</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map(
              ({
                document_type,
                total_documents,
                total_amount_base,
                total_amount_igv,
                total_amount_dgng_base,
                total_amount_dgng_igv,
                total_amount_documents,
              }) => (
                <TableRow key={document_type}>
                  <TableCell className="font-medium">
                    <Link
                      href="/receipts"
                      className={`${buttonVariants({ variant: "link" })} !p-0`}
                    >
                      {document_type}
                    </Link>
                  </TableCell>
                  <TableCell>{total_documents}</TableCell>
                  <TableCell className="text-right">
                    {formatWithCommas(total_amount_base.toFixed(2))}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatWithCommas(total_amount_igv.toFixed(2))}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatWithCommas(total_amount_dgng_base.toFixed(2))}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatWithCommas(total_amount_dgng_igv.toFixed(2))}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatWithCommas(total_amount_documents.toFixed(2))}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Total</TableCell>
              <TableCell className="text-right">
                {formatWithCommas(totalAmountofAll.toFixed(2))}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </main>
  );
}
