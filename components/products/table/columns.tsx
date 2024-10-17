"use client";

import { AssignLabel } from "@/components/assign-label";
import { DataTableColumnHeader } from "@/components/ui-custom/table-column-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ProductSchemaINFormated } from "@/lib/validations/product";
import { capitalizeFirstLetter } from "@/utils/capitalize-first-letter";
import { formatDate } from "@/utils/format-date";
import { formatWithCommas } from "@/utils/format-number-comas";
import { ColumnDef } from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<ProductSchemaINFormated>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Producto" />
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const id = row.original.id;
      return (
        <Link
          href={`/dashboard/products/${id}`}
          className={`${buttonVariants({
            variant: "link",
          })} max-w-[150px] capitalize !p-0 !h-auto !text-wrap whitespace-normal !line-clamp-3`}
        >
          {title.toLowerCase()}
        </Link>
      );
    },
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
      const labels = row.original.labels;
      const id_product = row.original.id;

      return (
        <div className="w-[150px] flex flex-wrap gap-2 items-center">
          {!labels.length ? (
            <AssignLabel id_product={id_product} labelsProduct={labels} />
          ) : (
            <>
              {labels.slice(0, 3).map(({ id, title }) => (
                <Badge key={id} variant="secondary">
                  <p className="max-w-[130px] truncate leading-snug">
                    {capitalizeFirstLetter(title)}
                  </p>
                </Badge>
              ))}
              {labels.length > 3 && (
                <Badge variant="outline">+ {labels.length - 3}</Badge>
              )}
              <Link href={`/dashboard/products/${row.original.id}`}>
                <CirclePlus className="size-4 stroke-primary" />
              </Link>
            </>
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
      const document_id = row.original.document_id;
      const document_code = row.original.document_code;
      return (
        <Link
          href={`/receipts/${document_id}-${document_code}`}
          className={`${buttonVariants({
            variant: "link",
          })} "w-[200px] capitalize text-balance font-medium !p-0 !h-auto"`}
        >
          {row.getValue("code")}
        </Link>
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
      return <span className="w-fit truncate">{formatDate(issue_date)}</span>;
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
      const id = row.original.Supplier.id;
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
      const unit_price = row.getValue("price") as string;
      return (
        <div className="flex items-center">
          <span>{formatWithCommas(unit_price)}</span>
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
      const igv = row.getValue("igv") as string;
      return (
        <div className="flex items-center">
          <span>{formatWithCommas(igv)}</span>
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
      const total = row.getValue("total") as string;
      return (
        <div className="flex items-center">
          <span>{formatWithCommas(total)}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
