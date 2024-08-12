"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ReceiptSchemaIN } from "@/lib/validations/receipt";
import { DataTableColumnHeader } from "@/components/ui-custom/table-column-header";
import { DataTableRowActions } from "./table-row-actions";
import { formatDate } from "@/utils/format-date";
import { formatWithCommas } from "@/utils/format-number-comas";

export const columns: ColumnDef<ReceiptSchemaIN>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número" />
    ),
    cell: ({ row }) => {
      return <span className="w-fit truncate">{row.getValue("code")}</span>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "ruc",
    accessorFn: (row) => `${row.Supplier.ruc}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="RUC" />
    ),
    cell: ({ row }) => {
      return <span className="w-fit truncate">{row.getValue("ruc")}</span>;
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
      const business_name = row.getValue("business_name") as string;
      return (
        <p className="w-[200px] text-balance capitalize">
          {business_name.toLowerCase()}
        </p>
      );
    },
  },
  {
    accessorKey: "issue_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
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
      return (
        <div className="flex max-w-[220px] items-center">
          <span>{row.getValue("currency_code")}</span>
        </div>
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
      <DataTableColumnHeader column={column} title="Tipo de comprobante" />
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
      return (
        <div className="flex items-center">
          <span>{formatWithCommas(row.getValue("amount_paid"))}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "amount_pending",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pendiente" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{formatWithCommas(row.getValue("amount_pending"))}</span>
        </div>
      );
    },
    enableSorting: false,
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
