"use client";

import { AssignLabel } from "@/components/assign-label";
import { DataTableColumnHeader } from "@/components/ui-custom/table-column-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { TypeLabel } from "@/types/label";
import { TypeProductTableFormat } from "@/types/product";
import { capitalizeFirstLetter } from "@/utils/capitalize-first-letter";
import { formatDate } from "@/utils/format-date";
import { formatWithCommas } from "@/utils/format-number-comas";
import { ColumnDef } from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

export function getProductsColumns(): ColumnDef<TypeProductTableFormat>[] {
  return [
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
      enableSorting: false,
    },
    {
      accessorKey: "labels",
      accessorFn: (row) => {
        const labelsProduct = row.labels || [];

        const id_product = row.id;

        return {
          labelsProduct,
          id_product,
          hasMoreThanThreeLabels: labelsProduct.length > 3,
          truncatedLabels: labelsProduct.slice(0, 3),
        };
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Etiquetas"
          href="/dashboard/settings"
        />
      ),
      cell: ({ row }) => {
        const value = row.getValue("labels") as {
          labelsProduct: TypeLabel[];
          id_product: number;
          hasMoreThanThreeLabels: boolean;
          truncatedLabels: TypeLabel[];
        };

        const {
          labelsProduct,
          id_product,
          hasMoreThanThreeLabels,
          truncatedLabels,
        } = value;

        return (
          <div className="w-[150px] flex flex-wrap gap-2 items-center">
            {!labelsProduct.length ? (
              <AssignLabel
                id_product={id_product}
                labelsProduct={labelsProduct}
              />
            ) : (
              <>
                {truncatedLabels.map(({ id, title }) => (
                  <Badge key={id} variant="secondary">
                    <p className="max-w-[130px] truncate leading-snug">
                      {capitalizeFirstLetter(title)}
                    </p>
                  </Badge>
                ))}
                {hasMoreThanThreeLabels && (
                  <Badge variant="outline">+ {labelsProduct.length - 3}</Badge>
                )}
                <AssignLabel
                  id_product={id_product}
                  labelsProduct={labelsProduct}
                  hasMoreThanThreeLabels={true}
                />
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
        const document_code = row.original.code;
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
        <DataTableColumnHeader
          column={column}
          title="Emisión"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        return (
          <p className="text-center">
            {formatDate(row.getValue("issue_date"))}
          </p>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "supplier_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Proveedor" />
      ),
      cell: ({ row }) => {
        const id = row.original.supplier_id;
        const business_name = row.getValue("supplier_name") as string;
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
      enableSorting: false,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Cantidad"
          className="text-right"
        />
      ),
      cell: ({ row }) => {
        return <p className="text-right">{row.getValue("amount")}</p>;
      },
      enableSorting: false,
    },
    {
      accessorKey: "unit_measure",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Medida"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const unit_measure = row.getValue("unit_measure") as string;
        return (
          <p className="text-center capitalize">{unit_measure.toLowerCase()}</p>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Precio unitario"
          className="text-right"
        />
      ),
      cell: ({ row }) => {
        return (
          <p className="text-right">
            {formatWithCommas(row.getValue("price"))}
          </p>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "igv",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="IGV"
          className="text-right"
        />
      ),
      cell: ({ row }) => {
        return (
          <p className="text-right">{formatWithCommas(row.getValue("igv"))}</p>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Importe Total"
          className="text-right"
        />
      ),
      cell: ({ row }) => {
        return (
          <p className="text-right">
            {formatWithCommas(row.getValue("total"))}
          </p>
        );
      },
      enableSorting: false,
    },
  ];
}
