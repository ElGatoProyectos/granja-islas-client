"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { backend_url } from "@/constants/config";

import { useReceiptPayment } from "@/hooks/useReceiptPayment";
import { formatDate } from "@/utils/format-date";
import { formatNumberWithCommas } from "@/utils/format-number-comas";

interface Props {
  document_code: string;
  document_id: string;
}
export function PaymentsTable({ document_code, document_id }: Props) {
  const { receipt } = useReceiptPayment({ document_code, document_id });
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
          {receipt.map(
            ({
              id,
              operation_number,
              type_currency,
              exchange_rate,
              amount_converted,
              date,
            }) => (
              <TableRow key={id}>
                <TableCell className="font-medium">
                  {formatDate(date)}
                </TableCell>
                <TableCell>banco</TableCell>
                <TableCell className="text-right">{operation_number}</TableCell>
                <TableCell className="text-right">{type_currency}</TableCell>
                <TableCell className="text-right">{exchange_rate}</TableCell>
                <TableCell className="text-right">
                  {formatNumberWithCommas(amount_converted)}
                </TableCell>
                <TableCell className="text-right">
                  <img
                    src={`${backend_url}/api/vouchers/${id}/image`}
                    alt="voucher"
                  />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </section>
  );
}
