"use client";

import { ColumnDef } from "@tanstack/react-table";

import { UserSchemaIN } from "@/lib/validations/user";
import { DataTableColumnHeader } from "./users-column-header";
import { DataTableRowActions } from "./users-row-actions";

export const user_columns: ColumnDef<UserSchemaIN>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombres" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <span className="w-fit truncate font-medium">
          <span className="capitalize">{name.toLowerCase()}</span>
        </span>
      );
    },
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Apellidos" />
    ),
    cell: ({ row }) => {
      const last_name = row.getValue("last_name") as string;

      return (
        <div className="flex  items-center">
          <span className="capitalize">{last_name.toLowerCase()}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Correo" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[220px] items-center">
          <span>{row.getValue("email")}</span>
        </div>
      );
    },
    enableSorting: false,
  },

  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rol" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("role") as string;
      return (
        <div className="flex items-center">
          <span className="capitalize">{name.toLowerCase()}</span>
        </div>
      );
    },
    enableSorting: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "phone",
    accessorFn: (row) => {
      const countryCode = row.country_code || "";
      const phone = row.phone || "";
      return `${countryCode} ${phone}`;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Celular" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-x-2 items-center">
          <span>
            {row.getValue("phone") === "" ? "" : row.getValue("phone")}
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
