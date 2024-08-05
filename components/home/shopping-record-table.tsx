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

const invoices = [
  {
    document_type: "01 - Factura",
    total_documents: "150",
    bi_taxed_dg: "100,000.00",
    igv_dg: "18,000.00",
    bi_taxed_dgng: "0.00",
    igv_dgng: "0.00",
    total: "118,000.00",
  },
  {
    document_type: "03 - Boleta de venta",
    total_documents: "200",
    bi_taxed_dg: "80,000.00",
    igv_dg: "14,400.00",
    bi_taxed_dgng: "0.00",
    igv_dgng: "0.00",
    total: "94,400.00",
  },
  {
    document_type: "07 - Nota de crédito",
    total_documents: "50",
    bi_taxed_dg: "20,000.00",
    igv_dg: "3,600.00",
    bi_taxed_dgng: "0.00",
    igv_dgng: "0.00",
    total: "23,600.00",
  },
  {
    document_type: "08 - Nota de débito",
    total_documents: "30",
    bi_taxed_dg: "10,000.00",
    igv_dg: "1,800.00",
    bi_taxed_dgng: "0.00",
    igv_dgng: "0.00",
    total: "11,800.00",
  },
];

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

export function ShoppingRecordTable() {
  return (
    <main className="flex flex-col">
      <div className="flex justify-between">
        <form className="flex items-center gap-x-2 mb-4">
          <span className="text-sm ml-4 font-semibold">Periodo</span>
          <Select>
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

          <Select>
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

          <Button type="button">Buscar</Button>
        </form>
        <DownloadExcel />
      </div>
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
          {invoices.map(
            ({
              document_type,
              total_documents,
              bi_taxed_dg,
              igv_dg,
              bi_taxed_dgng,
              igv_dgng,
              total,
            }) => (
              <TableRow key={document_type}>
                <TableCell className="font-medium">{document_type}</TableCell>
                <TableCell>{total_documents}</TableCell>
                <TableCell className="text-right">{bi_taxed_dg}</TableCell>
                <TableCell className="text-right">{igv_dg}</TableCell>
                <TableCell className="text-right">{bi_taxed_dgng}</TableCell>
                <TableCell className="text-right">{igv_dgng}</TableCell>
                <TableCell className="text-right">{total}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Total</TableCell>
            <TableCell className="text-right">S/.265,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </main>
  );
}
