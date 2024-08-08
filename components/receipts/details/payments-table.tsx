"use client";

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
import { usePayments } from "@/hooks/usePayments";

const receipts = [
  {
    document_type: "",
    total_documents: "",
    total_amount_base: "",
    total_amount_igv: "",
    total_amount_dgng_base: "",
    total_amount_dgng_igv: "",
    total_amount_documents: "",
  },
];

export function PaymentsTable() {
  return (
    <section className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Banco</TableHead>
            <TableHead className="text-right">Nro. de Operacion</TableHead>
            <TableHead className="text-right">Moneda</TableHead>
            <TableHead className="text-right">TC</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="text-right">Foto</TableHead>
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
                  {total_amount_base}
                </TableCell>
                <TableCell className="text-right">{total_amount_igv}</TableCell>
                <TableCell className="text-right">
                  {total_amount_dgng_base}
                </TableCell>
                <TableCell className="text-right">
                  {total_amount_dgng_igv}
                </TableCell>
                <TableCell className="text-right">
                  {total_amount_documents}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </section>
  );
}
