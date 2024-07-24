"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./table-column-header";
import { DataTableRowActions } from "./table-row-actions";
import { Supplier } from "./supplier-schema-table";
import { states } from "./supplier-filters";

export const columns: ColumnDef<Supplier>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "ruc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="RUC" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label);

      return (
        <span className="w-fit truncate font-medium">
          {row.getValue("ruc")}
        </span>
        // <div className="flex space-x-2">
        //   {label && <Badge variant="outline">{label.label}</Badge>}
        //   <span className="max-w-[500px] truncate font-medium">
        //     {row.getValue("ruc")}
        //   </span>
        // </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "corporate_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Razón social" />
    ),
    cell: ({ row }) => {
      const corporate_name = row.getValue("corporate_name") as string;

      return (
        <div className="flex w-[200px] items-center">
          <span className="capitalize">{corporate_name.toLowerCase()}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;

      return (
        <div className="flex max-w-[220px] items-center">
          <span className="capitalize">{type.toLowerCase()}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const state = states.find(
        (state) => state.value === row.getValue("status")
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
    accessorKey: "fiscal_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dirección fiscal" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("fiscal_address")}</span>
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
          <span>{row.getValue("phone")}</span>
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
