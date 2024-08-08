"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui-custom/table-column-header";
import { formatDate } from "@/utils/format-date";
import { formatWithCommas } from "@/utils/format-number-comas";
import { ProductSchemaIN } from "@/lib/validations/product";
import { DataTableRowActions } from "./table-row-actions";

export const columns: ColumnDef<ProductSchemaIN>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Producto" />
    ),
    cell: ({ row }) => {
      return (
        <span className="w-fit truncate font-medium">
          {row.getValue("title")}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="amount" />
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
      <DataTableColumnHeader column={column} title="unit_measure" />
    ),
    cell: ({ row }) => {
      return (
        <p className="w-[200px] text-balance font-medium">
          {row.getValue("unit_measure")}
        </p>
      );
    },
  },
  {
    accessorKey: "document_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="document_type" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("document_type")}</span>
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
