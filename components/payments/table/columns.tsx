"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui-custom/table-column-header";
import { DataTableRowActions } from "./table-row-actions";
import { formatDate } from "@/utils/format-date";
import { PaymentGeneralSchemaIN } from "@/lib/validations/payment";

export const columns: ColumnDef<PaymentGeneralSchemaIN>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span className="text-balance truncate capitalize">
          {status.toLowerCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "operation_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nro. de operación" />
    ),
    cell: ({ row }) => {
      return (
        <span className="w-fit truncate">
          {row.getValue("operation_number")}
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
      return (
        <span className="w-fit truncate">{row.getValue("type_currency")}</span>
      );
    },
  },
  {
    accessorKey: "amount_original",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Depositado" />
    ),
    cell: ({ row }) => {
      return (
        <span className="w-fit truncate">
          {row.getValue("amount_original")}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "unit_measure",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nro. de Comprobante" />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-balance capitalize">
          {row.getValue("unit_measure")}
        </p>
      );
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
  //   {
  //     accessorKey: "igv",
  //     accessorFn: (row) => `${row.User}`,
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="IGV" />
  //     ),
  //     cell: ({ row }) => {
  //       return (
  //         <div className="flex items-center">
  //           <span>{row.getValue("igv")}</span>
  //         </div>
  //       );
  //     },
  //     enableSorting: false,
  //   },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
