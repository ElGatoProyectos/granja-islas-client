"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { backend_url } from "@/constants/config";
import { formatDate } from "@/utils/format-date";
import { formatNumberWithCommas } from "@/utils/format-number-comas";
import { PaymentReceiptSchemaIN } from "@/lib/validations/payment";

interface Props {
  receiptPayments: PaymentReceiptSchemaIN[];
}
export function PaymentsTable({ receiptPayments }: Props) {
  return (
    <section className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Banco</TableHead>
            <TableHead>Nro. de Operacion</TableHead>
            <TableHead>Moneda</TableHead>
            <TableHead>Ingreso</TableHead>
            <TableHead>TC</TableHead>
            <TableHead>Soles</TableHead>
            <TableHead>Foto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receiptPayments.map(
            ({
              id,
              operation_number,
              type_currency,
              exchange_rate,
              amount_converted,
              amount_original,
              date,
              Bank,
            }) => (
              <TableRow key={id}>
                <TableCell className="font-medium">
                  {formatDate(date)}
                </TableCell>
                <TableCell>{Bank.title}</TableCell>
                <TableCell>{operation_number}</TableCell>
                <TableCell>{type_currency}</TableCell>
                <TableCell>{amount_original}</TableCell>
                <TableCell>
                  {exchange_rate === 1 ? "" : exchange_rate}
                </TableCell>
                <TableCell>
                  {formatNumberWithCommas(amount_converted)}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <img
                        src={`${backend_url}/api/vouchers/${id}/image`}
                        alt="voucher"
                        className="w-10 h-10 rounded-full cursor-pointer  object-contain"
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl border-0 bg-transparent p-0">
                      <DialogTitle></DialogTitle>
                      <img
                        src={`${backend_url}/api/vouchers/${id}/image`}
                        alt="voucher"
                        className="h-full w-full object-contain"
                      />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </section>
  );
}
