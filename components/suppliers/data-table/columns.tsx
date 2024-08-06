"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./table-column-header";
import { DataTableRowActions } from "./table-row-actions";

import { states } from "./supplier-filters";
import { SupplierSchemaIN } from "@/lib/validations/supplier";

export const columns: ColumnDef<SupplierSchemaIN>[] = [
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
      <DataTableColumnHeader column={column} title="Razón social" />
    ),
    cell: ({ row }) => {
      const business_name = row.getValue("business_name") as string;

      return (
        <div className="flex w-[200px] items-center">
          <span className="capitalize">{business_name.toLowerCase()}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "business_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      const business_type = row.getValue("business_type") as string;

      return (
        <div className="flex max-w-[220px] items-center">
          <span className="capitalize">{business_type.toLowerCase()}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "business_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const state = states.find(
        (state) => state.value === row.getValue("business_status")
      );

      if (!state) {
        return null;
      }

      return (
        <div className="flex items-center">
          <span>{state.label}</span>
        </div>
      );
    },
    enableSorting: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "business_direction",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dirección fiscal" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("business_direction")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    accessorFn: (row) => `${row.country_code} ${row.phone}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Celular" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-x-2 items-center">
          <span>
            {row.getValue("phone") === "null null" ? "" : row.getValue("phone")}
          </span>
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
