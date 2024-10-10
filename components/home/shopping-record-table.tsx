"use client";
import { buttonVariants } from "@/components/ui/button";
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
import { FormatedTotalAmountReceipts } from "@/types/dashboard";
import { formatWithCommas } from "@/utils/format-number-comas";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Props {
  receipts: FormatedTotalAmountReceipts[];
  totalAmountofAll: number;
  ruc: string;
}

export function ShoppingRecordTable({
  receipts,
  totalAmountofAll,
  ruc,
}: Props) {
  const searchParams = useSearchParams();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const startYear = searchParams.get("startYear") ?? currentYear;
  const startMonth = searchParams.get("startMonth") ?? currentMonth;
  const endYear = searchParams.get("endYear") ?? currentYear;
  const endMonth = searchParams.get("endMonth") ?? currentMonth;

  return (
    <Table>
      <TableCaption>
        Si los datos no se muestran, puede sincronizarlos con SUNAT utilizando
        el siguiente
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
                  href={{
                    pathname: "/receipts",
                    query: {
                      ruc,
                      startYear,
                      startMonth,
                      endYear,
                      endMonth,
                    },
                  }}
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
  );
}
