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
import { Button } from "@/components/ui/button";
import { DownloadExcel } from "../download-excel";
import { Dispatch, SetStateAction } from "react";
import { FormatedTotalAmountReceipts } from "@/hooks/useDashboard";
import { formatWithCommas } from "@/utils/format-number-comas";
import { DataTableSkeleton } from "./table-skeleton";
import { defaultDate } from "@/utils/default-date";

const months = [
  { label: "Enero", value: "1" },
  { label: "Febrero", value: "2" },
  { label: "Marzo", value: "3" },
  { label: "Abril", value: "4" },
  { label: "Mayo", value: "5" },
  { label: "Junio", value: "6" },
  { label: "Julio", value: "7" },
  { label: "Agosto", value: "8" },
  { label: "Septiembre", value: "9" },
  { label: "Octubre", value: "10" },
  { label: "Noviembre", value: "11" },
  { label: "Diciembre", value: "12" },
];

interface Props {
  setYear: Dispatch<SetStateAction<string>>;
  setMonth: Dispatch<SetStateAction<string>>;
  receipts: FormatedTotalAmountReceipts[];
  loading: boolean;
  totalAmountofAll: number;
}

export function ShoppingRecordTable({
  setMonth,
  setYear,
  receipts,
  loading,
  totalAmountofAll,
}: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formShopping = Object.fromEntries(new FormData(e.currentTarget));
    const { year, month } = formShopping;
    setMonth(month as string);
    setYear(year as string);
  };

  const { adjustedYear, previousMonth } = defaultDate();

  return (
    <main className="flex flex-col">
      <div className="flex justify-between">
        <form
          className="flex items-center gap-x-2 mb-4"
          onSubmit={handleSubmit}
        >
          <span className="text-sm ml-4 font-semibold">Periodo</span>
          <Select name="year" defaultValue={adjustedYear}>
            <SelectTrigger className="w-[230px]">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Año</SelectLabel>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select name="month" defaultValue={previousMonth}>
            <SelectTrigger className="w-[230px]">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Mes</SelectLabel>
                {months.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button>Buscar</Button>
        </form>
        <DownloadExcel />
      </div>
      {loading ? (
        <DataTableSkeleton
          columnCount={7}
          rowCount={5}
          withPagination={false}
          shrinkZero
          showViewOptions={false}
        />
      ) : (
        <Table>
          <TableCaption>Lista de tus comprobantes.</TableCaption>
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
                  <TableCell className="font-medium">{document_type}</TableCell>
                  <TableCell>{total_documents}</TableCell>
                  <TableCell className="text-right">
                    {formatWithCommas(total_amount_base)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatWithCommas(total_amount_igv)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatWithCommas(total_amount_dgng_base)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatWithCommas(total_amount_dgng_igv)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatWithCommas(total_amount_documents)}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Total</TableCell>
              <TableCell className="text-right">
                {formatWithCommas(totalAmountofAll)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </main>
  );
}
