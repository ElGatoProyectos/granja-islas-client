"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui-custom/table-column-header";
import { DataTableRowActions } from "./table-row-actions";
import { formatDate } from "@/utils/format-date";
import { ListsSchemaIN } from "@/lib/validations/list";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const columns: ColumnDef<ListsSchemaIN>[] = [
  {
    accessorKey: "label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Etiqueta de producto" />
    ),
    cell: ({ row }) => {
      const label = row.getValue("label") as string;
      const id = row.original.label_id;
      return (
        <Link
          href={`/dashboard/list/${id}`}
          className={`${buttonVariants({
            variant: "link",
          })} max-w-[150px] capitalize !p-0 !h-auto !text-wrap whitespace-normal !line-clamp-3`}
        >
          {label.toLowerCase()}
        </Link>
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
      const averagePrice = row.getValue("averagePrice") as number;
      return (
        <span className="w-fit truncate font-medium">
          {averagePrice.toFixed(2)}
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
      const lowestPrice = row.getValue("lowestPrice") as number;
      return (
        <span className="w-fit truncate font-medium">
          {lowestPrice.toFixed(2)}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "higher_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio mas Alto" />
    ),
    cell: ({ row }) => {
      const higher_price = row.getValue("higher_price") as number;
      return (
        <span className="w-fit truncate font-medium">
          {higher_price.toFixed(2)}
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
      const id = row.original.supplier.id;
      const business_name = row.getValue("business_name") as string;
      return (
        <Link
          href={`/dashboard/suppliers/${id}`}
          className={`${buttonVariants({
            variant: "link",
          })} "w-[200px] capitalize text-balance font-medium !p-0 !h-auto"`}
        >
          {business_name.toLowerCase()}
        </Link>
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
      const business_status = row.getValue("business_status") as string;
      return (
        <div className="flex items-center capitalize">
          <span>{business_status.toLowerCase()}</span>
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
