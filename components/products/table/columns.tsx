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
        <p className="w-[200px] text-balance truncate capitalize">
          {title.toLowerCase()}
        </p>
      );
    },
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
      const unit_measure = row.getValue("unit_measure") as string;
      return (
        <p className="text-balance capitalize">{unit_measure.toLowerCase()}</p>
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
    accessorKey: "igv",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IGV" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("igv")}</span>
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
          <span>{row.getValue("total")}</span>
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
