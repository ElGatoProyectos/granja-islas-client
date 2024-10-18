import { AssignLabel } from "@/components/assign-label";
import { DataTableColumnHeader } from "@/components/ui-custom/table-column-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { TypeLabel } from "@/types/label";
import { TypeProductsOfSupplierTable } from "@/types/supplier";
import { capitalizeFirstLetter } from "@/utils/capitalize-first-letter";
import { formatDate } from "@/utils/format-date";
import { formatWithCommas } from "@/utils/format-number-comas";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export function getProductsOfSupplierColumns(): ColumnDef<TypeProductsOfSupplierTable>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Producto" />
      ),
      cell: ({ row }) => {
        const title = row.getValue("title") as string;
        return (
          <Link
            className={`${buttonVariants({
              variant: "link",
            })} max-w-[180px] capitalize !p-0 !h-auto !text-wrap whitespace-normal !line-clamp-3`}
            href={`/dashboard/products/${row.original.id}`}
          >
            {title.toLowerCase()}
          </Link>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "product_labels",
      accessorFn: (row) => {
        const labelsProduct = row.product_labels || [];
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
        const value = row.getValue("product_labels") as {
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
      accessorKey: "document_code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Número" />
      ),
      cell: ({ row }) => {
        const type_code = row.original.document_type_code;
        const id = row.original.document_id;
        return (
          <Link
            href={{
              pathname: `/receipts/${id}-${type_code}`,
            }}
            className={`${buttonVariants({
              variant: "link",
            })} capitalize font-medium !px-0 !h-auto`}
          >
            {row.getValue("document_code")}
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
        return (
          <span className="w-fit truncate">{formatWithCommas(price)}</span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "igv",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="IGV Total" />
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
        return (
          <span className="w-fit truncate">{formatWithCommas(total)}</span>
        );
      },
      enableSorting: false,
    },
  ];
}
