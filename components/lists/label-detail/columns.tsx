"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui-custom/table-column-header";
import { formatDate } from "@/utils/format-date";
import { FormatDocumentsOfLabelType } from "@/lib/validations/label";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const columns: ColumnDef<FormatDocumentsOfLabelType>[] = [
  {
    accessorKey: "issue_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de emisión" />
    ),
    cell: ({ row }) => {
      return (
        <span className="w-fit truncate font-medium">
          {formatDate(row.getValue("issue_date"))}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número" />
    ),
    cell: ({ row }) => {
      return (
        <span className="w-fit truncate font-medium">
          {row.getValue("code")}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "ruc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="RUC" />
    ),
    cell: ({ row }) => {
      return (
        <span className="w-fit truncate font-medium">
          {row.getValue("ruc")}
        </span>
      );
    },
    enableSorting: false,
  },

  {
    accessorKey: "business_name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Proveedor"
        href="/dashboard/suppliers"
      />
    ),
    cell: ({ row }) => {
      const id = row.original.id_supplier;
      const business_name = row.getValue("business_name") as string;
      return (
        <Link
          href={`/dashboard/suppliers/${id}`}
          className={`${buttonVariants({
            variant: "link",
          })} "w-[200px] capitalize text-balance font-medium !p-0  !h-auto"`}
        >
          {business_name.toLowerCase()}
        </Link>
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
        <span className="w-fit truncate font-medium">
          {row.getValue("currency_code")}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio unitario" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return (
        <span className="w-fit truncate font-medium">{price.toFixed(2)}</span>
      );
    },
    enableSorting: false,
  },
];
