"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { backend_url } from "@/constants/config";
import { formatDate } from "@/utils/format-date";
import { formatWithCommas } from "@/utils/format-number-comas";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductsOfReceiptIN } from "@/lib/validations/receipt";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface Props {
  products: ProductsOfReceiptIN[];
}

export function ProductsOfReceipt({ products }: Props) {
  return (
    <section className="w-full">
      <ScrollArea className="h-[510px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Medida</TableHead>
              <TableHead>Precio unitario</TableHead>
              <TableHead>IGV</TableHead>
              <TableHead>Importe Total</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map(
              ({ id, title, amount, unit_measure, price, igv, total }) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/products/${id}`}
                      className={`${buttonVariants({
                        variant: "link",
                      })} max-w-[250px] capitalize !p-0 !h-auto !text-wrap whitespace-normal !line-clamp-3`}
                    >
                      {title.toLowerCase()}
                    </Link>
                  </TableCell>
                  <TableCell>{amount}</TableCell>
                  <TableCell>{unit_measure}</TableCell>
                  <TableCell>{formatWithCommas(price)}</TableCell>
                  <TableCell>{formatWithCommas(igv)}</TableCell>
                  <TableCell>{formatWithCommas(total)}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </section>
  );
}
