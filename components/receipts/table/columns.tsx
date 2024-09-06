"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ReceiptSchemaIN } from "@/lib/validations/receipt";
import { DataTableColumnHeader } from "@/components/ui-custom/table-column-header";
import { DataTableRowActions } from "./table-row-actions";
import { formatDate } from "@/utils/format-date";
import { formatWithCommas } from "@/utils/format-number-comas";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { USD } from "@/constants/currency";
import { CREDITO } from "@/constants/type-payments";

export const columns: ColumnDef<ReceiptSchemaIN>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número" />
    ),
    cell: ({ row }) => {
      const id = row.original.id;
      const document_code = row.original.document_code;
      return (
        <Link
          href={`/receipts/${id}-${document_code}`}
          className={`${buttonVariants({
            variant: "link",
          })} "w-[200px] capitalize text-balance font-medium !p-0 !h-auto"`}
        >
          {row.getValue("code")}
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
      return (
        <span className="w-fit truncate">
          {row.getValue("document_description")}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "business_name",
    accessorFn: (row) => `${row.Supplier.business_name}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Proveedor" />
    ),
    cell: ({ row }) => {
      const id = row.original.Supplier.id;
      const business_name = row.getValue("business_name") as string;
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
  },
  {
    accessorKey: "issue_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Emisión" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{formatDate(row.getValue("issue_date"))}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "currency_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Moneda" />
    ),
    cell: ({ row }) => {
      const currency_code = row.getValue("currency_code") as string;
      return (
        <span
          className={cn(
            "text-balance truncate capitalize font-bold",
            currency_code === USD ? "text-green-500" : "text-slate-500"
          )}
        >
          {currency_code}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "amount_base",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monto" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{formatWithCommas(row.getValue("amount_base"))}</span>
        </div>
      );
    },
    enableSorting: false,
  },

  {
    accessorKey: "igv",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IGV" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{formatWithCommas(row.getValue("igv"))}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Importe Total" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{formatWithCommas(row.getValue("total"))}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "bill_status_payment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de pago" />
    ),
    cell: ({ row }) => {
      const bill_status_payment = row.getValue("bill_status_payment") as string;
      return (
        <div className="flex items-center">
          <span className="capitalize">
            {bill_status_payment.toLowerCase()}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "bill_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const bill_status = row.getValue("bill_status") as string;
      return (
        <div className="flex items-center">
          <span className="capitalize">{bill_status.toLowerCase()}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "amount_paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pagado" />
    ),
    cell: ({ row }) => {
      const type_payment = row.original.bill_status_payment;
      return type_payment === CREDITO ? (
        <div className="flex items-center">
          <span>{formatWithCommas(row.getValue("amount_paid"))}</span>
        </div>
      ) : null;
    },
    enableSorting: false,
  },
  {
    accessorKey: "amount_pending",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pendiente" />
    ),
    cell: ({ row }) => {
      const type_payment = row.original.bill_status_payment;
      return type_payment === CREDITO ? (
        <div className="flex items-center">
          <span>{formatWithCommas(row.getValue("amount_pending"))}</span>
        </div>
      ) : null;
    },
    enableSorting: false,
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
