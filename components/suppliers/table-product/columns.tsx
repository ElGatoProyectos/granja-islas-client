"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui-custom/table-column-header";
import { SupplierProductsFormatSchema } from "@/lib/validations/supplier";
import { formatWithCommas } from "@/utils/format-number-comas";
import { formatDate } from "@/utils/format-date";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const columns: ColumnDef<SupplierProductsFormatSchema>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Producto" />
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <p className="capitalize max-w-[250px]">{title.toLowerCase()}</p>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "labels",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Etiquetas"
        href="/dashboard/settings"
      />
    ),
    cell: ({ row }) => {
      const labels = row.original.DetailProductLabel;
      return (
        <div className="w-[180px] flex flex-wrap gap-2">
          {labels.length ? (
            labels.map(({ label }) => (
              <Badge key={label} variant="secondary">
                {label}
              </Badge>
            ))
          ) : (
            <Link
              href={`/dashboard/products/${row.original.id}`}
              className={`${buttonVariants({ variant: "link" })} !p-0`}
            >
              Etiquetar
            </Link>
          )}
        </div>
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
      return <span className="w-fit truncate">{row.getValue("code")}</span>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "issue_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Emisión" />
    ),
    cell: ({ row }) => {
      const issue_date = row.getValue("issue_date") as string;
      return <span className="w-fit truncate">{formatDate(issue_date)}</span>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cantidad" />
    ),
    cell: ({ row }) => {
      return <span className="w-fit truncate">{row.getValue("amount")}</span>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "unit_measure",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medida" />
    ),
    cell: ({ row }) => {
      return (
        <span className="w-fit truncate">{row.getValue("unit_measure")}</span>
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
      const price = row.getValue("price") as string;
      return <span className="w-fit truncate">{formatWithCommas(price)}</span>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "igv",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IGV" />
    ),
    cell: ({ row }) => {
      const igv = row.getValue("igv") as string;
      return <span className="w-fit truncate">{formatWithCommas(igv)}</span>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Importe Total" />
    ),
    cell: ({ row }) => {
      const total = row.getValue("total") as string;
      return <span className="w-fit truncate">{formatWithCommas(total)}</span>;
    },
    enableSorting: false,
  },
];
