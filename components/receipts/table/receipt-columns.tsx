"use client";

import { DataTableColumnHeader } from "@/components/ui-custom/table-column-header";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { USD } from "@/constants/currency";
import { typesSpanishFormat } from "@/constants/type-document";
import { cn } from "@/lib/utils";
import { TypeReceipt } from "@/types/receipt";
import { formatDate } from "@/utils/format-date";
import { formatWithCommas } from "@/utils/format-number-comas";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ReceiptDownloadPdf } from "./download-pdf";

export function getReceiptsColumns(): ColumnDef<TypeReceipt>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "num_serie",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Serie" />
      ),
      cell: ({ row }) => {
        const id = row.original.id;
        const document_code = row.original.document_code;
        return (
          <Link
            href={`/receipts/${id}-${document_code}`}
            className={`${buttonVariants({
              variant: "link",
            })} capitalize font-medium !px-0 !h-auto`}
          >
            {row.getValue("num_serie")}
          </Link>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "num_cpe",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nro." />
      ),
      cell: ({ row }) => {
        const id = row.original.id;
        const document_code = row.original.document_code;
        return (
          <Link
            href={`/receipts/${id}-${document_code}`}
            className={`${buttonVariants({
              variant: "link",
            })} capitalize font-medium !px-0 !h-auto`}
          >
            {row.getValue("num_cpe")}
          </Link>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "document_description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo de documento" />
      ),
      cell: ({ row }) => {
        const type_document = row.getValue("document_description") as string;
        const type = typesSpanishFormat.find(
          (item) => item.value.toUpperCase() === type_document.toUpperCase()
        )?.label;
        return <p>{type}</p>;
      },
      enableSorting: false,
    },
    {
      accessorKey: "supplier_name",
      accessorFn: (row) => `${row.supplier_name}`,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Proveedor" />
      ),
      cell: ({ row }) => {
        const id = row.original.supplier_id;
        const business_name = row.getValue("supplier_name") as string;
        return (
          <Link
            href={`/dashboard/suppliers/${id}`}
            className={`${buttonVariants({
              variant: "link",
            })} max-w-[150px] capitalize !p-0 !h-auto !text-wrap whitespace-normal !line-clamp-3`}
          >
            {business_name.toLowerCase()}
          </Link>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "issue_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Emisión" />
      ),
      cell: ({ row }) => {
        return <span>{formatDate(row.getValue("issue_date"))}</span>;
      },
      enableSorting: false,
    },
    {
      accessorKey: "currency_code",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Moneda"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const currency_code = row.getValue("currency_code") as string;
        return (
          <p
            className={cn(
              "text-center truncate capitalize font-bold",
              currency_code === USD ? "text-green-500" : "text-slate-500"
            )}
          >
            {currency_code}
          </p>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "amount_base",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Monto"
          className="text-right"
        />
      ),
      cell: ({ row }) => {
        return (
          <p className="text-right">
            {formatWithCommas(row.getValue("amount_base"))}
          </p>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "igv",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="IGV"
          className="text-right"
        />
      ),
      cell: ({ row }) => {
        return (
          <p className="text-right">{formatWithCommas(row.getValue("igv"))}</p>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "base_igv",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="%IGV"
          className="text-right"
        />
      ),
      cell: ({ row }) => {
        const percentage = row.getValue("base_igv") as number;
        const value = percentage === 0.18 ? "18" : "10";
        return <p className="text-right">{value}%</p>;
      },
      enableSorting: false,
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Importe Total"
          className="text-right"
        />
      ),
      cell: ({ row }) => {
        return (
          <p className="text-right">
            {formatWithCommas(row.getValue("total"))}
          </p>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "bill_status_payment",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Tipo de pago"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const bill_status_payment = row.getValue(
          "bill_status_payment"
        ) as string;
        return (
          <p className="capitalize text-center">
            {bill_status_payment.toLowerCase()}
          </p>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "bill_status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Estado"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const bill_status = row.getValue("bill_status") as string;
        return (
          <p className="capitalize text-center">{bill_status.toLowerCase()}</p>
        );
      },
      enableSorting: false,
    },
    {
      id: "actions",
      cell: ({ row }) => <ReceiptDownloadPdf row={row} />,
    },
  ];
}
