"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui-custom/table-column-header";
import { DataTableRowActions } from "./table-row-actions";
import { formatDate } from "@/utils/format-date";
import { PaymentGeneralSchemaIN } from "@/lib/validations/payment";
import { translateStatus } from "@/utils/translate-states-payment";
import { cn } from "@/lib/utils";
import { APPROVED, PENDING, REFUSED } from "@/constants/status-payment";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { backend_url } from "@/constants/config";
import { formatWithCommas } from "@/utils/format-number-comas";
import { USD } from "@/constants/currency";

export const columns: ColumnDef<PaymentGeneralSchemaIN>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={cn(
            "text-balance truncate capitalize",
            status === APPROVED
              ? "text-green-500"
              : status === REFUSED
              ? "text-red-500"
              : status === PENDING
              ? "text-slate-500"
              : ""
          )}
        >
          {translateStatus(status)}
        </span>
      );
    },
  },
  {
    accessorKey: "operation_number",
    accessorFn: (row) => `${row.operation_number}_/${row.color}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nro. de operación" />
    ),
    cell: ({ row }) => {
      const opandcolor = row.getValue("operation_number") as string;
      const parts = opandcolor.toString().split("_/");
      return (
        <span
          className={cn(`w-fit truncate `, parts[1] ? "text-orange-400" : "")}
        >
          {parts[0]}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de emisión" />
    ),
    cell: ({ row }) => {
      return (
        <span className="w-fit truncate">
          {formatDate(row.getValue("date"))}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "type_currency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Moneda" />
    ),
    cell: ({ row }) => {
      const currency = row.getValue("type_currency") as string;
      return (
        <span
          className={cn(
            "text-balance truncate capitalize",
            currency === USD ? "text-green-500" : "text-slate-500"
          )}
        >
          {row.getValue("type_currency")}
        </span>
        // <span className="w-fit truncate">{row.getValue("type_currency")}</span>
      );
    },
  },
  {
    accessorKey: "amount_original",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Depositado" />
    ),
    cell: ({ row }) => {
      const amount_original = row.getValue("amount_original") as number;
      return (
        <span className="w-fit truncate">
          {formatWithCommas(amount_original)}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "amount_converted",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Soles" />
    ),
    cell: ({ row }) => {
      const amount_converted = row.getValue("amount_converted") as number;
      return (
        <span className="w-fit truncate">
          S/.{formatWithCommas(amount_converted)}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Foto" />
    ),
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <img
              src={`${backend_url}/api/vouchers/${id}/image`}
              alt="voucher"
              className="w-10 h-10 rounded-full cursor-pointer  object-contain"
            />
          </DialogTrigger>
          <DialogContent className="max-w-5xl border-0 bg-transparent p-0">
            <DialogTitle></DialogTitle>
            <img
              src={`${backend_url}/api/vouchers/${id}/image`}
              alt="voucher"
              className="h-full w-full object-contain"
            />
          </DialogContent>
        </Dialog>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "code",
    accessorFn: (row) => `${row.document.code}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nro. de Comprobante" />
    ),
    cell: ({ row }) => {
      return <p className="text-balance capitalize">{row.getValue("code")}</p>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "user_name",
    accessorFn: (row) => `${row.User.name}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usuario" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("user_name")}</span>
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
