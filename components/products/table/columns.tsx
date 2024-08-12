"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui-custom/table-column-header";
import { ProductSchemaINFormated } from "@/lib/validations/product";
import { DataTableRowActions } from "./table-row-actions";
import { formatDate } from "@/utils/format-date";

export const columns: ColumnDef<ProductSchemaINFormated>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Producto" />
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <span className="w-fit truncate font-medium capitalize">
          {title.toLowerCase()}
        </span>
      );
    },
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
    accessorKey: "issue_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Emisión" />
    ),
    cell: ({ row }) => {
      const issue_date = row.getValue("issue_date") as string;
      return (
        <span className="w-fit truncate font-medium">
          {formatDate(issue_date)}
        </span>
      );
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
      return (
        <span className="w-fit truncate font-medium">
          {row.getValue("ruc")}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "bussines_name",
    accessorFn: (row) => `${row.Supplier.business_name}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Proveedor" />
    ),
    cell: ({ row }) => {
      const bussines_name = row.getValue("bussines_name") as string;
      return (
        <span className="w-fit truncate font-medium capitalize">
          {bussines_name.toLowerCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cantidad" />
    ),
    cell: ({ row }) => {
      return (
        <span className="w-fit truncate font-medium">
          {row.getValue("amount")}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "unit_measure",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medida" />
    ),
    cell: ({ row }) => {
      const unit_measure = row.getValue("unit_measure") as string;
      return (
        <p className="text-balance font-medium capitalize">
          {unit_measure.toLowerCase()}
        </p>
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
      return (
        <div className="flex items-center">
          <span>{row.getValue("price")}</span>
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
