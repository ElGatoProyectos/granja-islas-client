"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./table-column-header";
import { DataTableRowActions } from "./table-row-actions";
import { Supplier } from "./supplier-schema-table";

export const columns: ColumnDef<Supplier>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ids" />
    ),
    cell: ({ row }) => <div className="w-fit">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "ruc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="RUC" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label);

      return (
        <span className="max-w-[500px] truncate font-medium">
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
      // const status = statuses.find(
      //   (status) => status.value === row.getValue("corporate_name")
      // );

      // if (!status) {
      //   return null;
      // }

      return (
        <div className="flex w-[100px] items-center">
          {/* {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )} */}
          <span>{row.getValue("corporate_name")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      // const priority = priorities.find(
      //   (priority) => priority.value === row.getValue("type")
      // );

      // if (!priority) {
      //   return null;
      // }

      return (
        <div className="flex items-center">
          {/* {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )} */}
          <span>{row.getValue("type")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("status")}</span>
        </div>
      );
    },
    enableSorting: false,
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
    accessorKey: "country_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código de pais" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("country_code")}</span>
        </div>
      );
    },
    enableSorting: false,
  },

  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Celular" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
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
