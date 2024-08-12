"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui-custom/table-column-header";
import { DataTableRowActions } from "./table-row-actions";
import { formatDate } from "@/utils/format-date";
import { ListsSchemaIN } from "@/lib/validations/list";

export const columns: ColumnDef<ListsSchemaIN>[] = [
  {
    accessorKey: "label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Etiqueta de producto" />
    ),
    cell: ({ row }) => {
      return (
        <span className="w-fit truncate font-medium">
          {row.getValue("label")}
        </span>
      );
    },
  },
  {
    accessorKey: "lastPurchaseDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ultima compra" />
    ),
    cell: ({ row }) => {
      const issue_date = row.getValue("lastPurchaseDate") as string;
      return (
        <span className="w-fit truncate font-medium">
          {formatDate(issue_date)}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "currencyCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Moneda" />
    ),
    cell: ({ row }) => {
      return (
        <span className="w-fit truncate font-medium">
          {row.getValue("currencyCode")}
        </span>
      );
    },
    enableSorting: false,
  },

  {
    accessorKey: "lastPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ultimo precio" />
    ),
    cell: ({ row }) => {
      return (
        <span className="w-fit truncate font-medium">
          {row.getValue("lastPrice")}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "averagePrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio promedio" />
    ),
    cell: ({ row }) => {
      return (
        <span className="w-fit truncate font-medium">
          {row.getValue("averagePrice")}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "lowestPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio mas bajo" />
    ),
    cell: ({ row }) => {
      return (
        <span className="w-fit truncate font-medium">
          {row.getValue("lowestPrice")}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "business_name",
    accessorFn: (row) => `${row.supplier.business_name}`,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Proveedor de mejor precio"
      />
    ),
    cell: ({ row }) => {
      return (
        <p className="w-[200px] text-balance font-medium">
          {row.getValue("business_name")}
        </p>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "business_status",
    accessorFn: (row) => `${row.supplier.business_status}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("business_status")}</span>
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
