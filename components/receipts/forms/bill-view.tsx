import { Separator } from "@/components/ui/separator";
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
const receipts = [
  {
    document_type: "holo",
    total_documents: "holo",
  },
];

export function BillView() {
  return (
    <div className="grid grid-cols-2">
      <div className="p-6 pr-0">
        <p>Empresa de Transporte Don Agusto S.A.C</p>
        <p>Jr. las flores 167, San Juan de Lurigancho</p>
        <p>Lima, Peru</p>
      </div>
      <div className="p-6 pl-0">
        <p>Factura Electronica</p>
        <p>RUC: 20535014940</p>
        <p>FFA1-2799</p>
      </div>
      <Separator className="col-span-2" />
      <div className="grid grid-cols-2 col-span-2 p-6">
        <p>Fecha de emisión</p>
        <p>2024-06-01</p>
        <p>Señor(es)</p>
        <p>Taller de soldadura Martinez E.I.R.L</p>
        <p>RUC</p>
        <p>20452342236</p>
        <p>Domicilio Fiscal</p>
        <p>Jr. las flores 167, San juan de lurigancho, Lima, Peru</p>
        <p>Moneda</p>
        <p>PEN</p>
      </div>
      <Separator className="col-span-2" />
      <div className="grid grid-cols-2 col-span-2 p-6">
        <p>Observación</p>
        <p>Factura suejata al spot del 12%</p>
        <p>Forma de pago</p>
        <p>Credito</p>
        <p>Fecha de vencimiento</p>
        <p>2024-07-01</p>
      </div>
      <Separator className="col-span-2" />
      <Table className="col-span-2">
        <TableCaption>Lista de tus comprobantes.</TableCaption>
        <TableHeader className="col-span-2">
          <TableRow>
            <TableHead>Tipo de documento</TableHead>
            <TableHead>Total de documentos</TableHead>
            <TableHead>Total de documentos2</TableHead>
            <TableHead>Total de documentos3</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="col-span-2">
          {receipts.map(({ document_type, total_documents }) => (
            <TableRow key={document_type}>
              <TableCell className="font-medium">{document_type}</TableCell>
              <TableCell>{total_documents}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
