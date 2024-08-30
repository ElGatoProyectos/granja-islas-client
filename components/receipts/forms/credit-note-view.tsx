import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PEN } from "@/constants/currency";
import { useCompanySession } from "@/context/company-context";
import { creditNoteSchemaCreate } from "@/lib/validations/receipt-forms/bill";
import { SupplierSchemaFilter } from "@/lib/validations/supplier";
import { formatWithCommas } from "@/utils/format-number-comas";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export function CreditNoteView({
  form,
  totalSuppliers,
}: {
  form: UseFormReturn<z.infer<typeof creditNoteSchemaCreate>>;
  totalSuppliers: SupplierSchemaFilter[];
}) {
  const { company } = useCompanySession();

  const supplierSelected = totalSuppliers.find(
    (supplier) => supplier.id.toString() === form.watch("supplier_id")
  );

  const products = form.watch("products") || [];
  const subtotal = products.reduce((acc, product) => {
    const price = parseFloat(product.price) || 0;
    const amount = parseFloat(product.amount) || 0;
    return acc + price * amount;
  }, 0);

  const percentage = 18;
  const taxAmount = (subtotal * percentage) / 100;
  const totalWithTax = subtotal + taxAmount;

  return (
    <Card className="w-full">
      <div className="grid grid-cols-2">
        <div className="p-8 pr-6">
          {company ? (
            <>
              <p className="capitalize font-semibold text-lg text-balance">
                {company?.business_name.toLowerCase() +
                  company?.business_type.toLowerCase()}
              </p>
              <p className="capitalize text-muted-foreground text-balance">
                {company.business_direction_fiscal.toLowerCase()}
              </p>
            </>
          ) : null}
        </div>
        <div className="p-8 pl-0 space-y-1">
          <p className="text-primary font-semibold">Nota de crédito</p>
          {company ? (
            <>
              <p>RUC: {company.ruc}</p>
            </>
          ) : null}

          {form.watch("code") ? (
            <p className="text-muted-foreground">{form.watch("code")}</p>
          ) : (
            <Skeleton className="h-6 w-24" />
          )}
        </div>
        <Separator className="col-span-2" />
        <div className="grid grid-cols-2 col-span-2 p-8 gap-2">
          <p className="text-muted-foreground">Fecha de emisión</p>
          {form.watch("issue_date") ? (
            <p>{format(form.watch("issue_date"), "yyyy-MM-dd")}</p>
          ) : (
            <Skeleton className="h-full w-28" />
          )}
          <p className="text-muted-foreground">Señor(es)</p>
          {supplierSelected ? (
            <p className="capitalize text-balance">
              {supplierSelected.business_name.toLowerCase()}
            </p>
          ) : (
            <Skeleton className="h-full w-52" />
          )}
          <p className="text-muted-foreground">RUC</p>
          {supplierSelected ? (
            <p className="capitalize">{supplierSelected.ruc}</p>
          ) : (
            <Skeleton className="h-full w-40" />
          )}

          <p className="text-muted-foreground">Domicilio Fiscal</p>
          {supplierSelected ? (
            <p className="capitalize text-balance">
              {supplierSelected.business_direction}
            </p>
          ) : (
            <Skeleton className="h-full w-40" />
          )}
          <p className="text-muted-foreground">Moneda</p>
          {form.watch("currency_code") ? (
            <p>
              {form.watch("currency_code") === PEN
                ? "PEN / Soles"
                : form.watch("currency_code")}
            </p>
          ) : (
            <Skeleton className="h-6 w-24" />
          )}
        </div>

        <Separator className="col-span-2" />
        <div className="col-span-2 pb-10 p-8">
          <Table>
            <TableCaption>Lista de tus comprobantes.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-0 w-full">Descripción</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-center">Medida</TableHead>
                <TableHead className="text-right">Precio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products
                ? products.map(({ amount, price, title, unit_measure }) => (
                    <TableRow key={title + amount + price}>
                      <TableCell className="font-medium pl-0">
                        {title}
                      </TableCell>
                      <TableCell className="text-right">{amount}</TableCell>
                      <TableCell className="text-center">
                        {unit_measure}
                      </TableCell>
                      <TableCell className="text-right">
                        {form.getValues("currency_code") === PEN ? (
                          <div>
                            {price ? `S/.${formatWithCommas(price)}` : ""}
                          </div>
                        ) : (
                          <div>
                            {price ? `$${formatWithCommas(price)}` : ""}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
            <TableFooter className=" gap-2 bg-transparent">
              <TableRow className="w-full col-span-2">
                <TableCell className="pl-0 max-w-32 overflow-hidden">
                  <span className="text-muted-foreground">Notas</span>
                  <p>
                    {form.watch("note") ? (
                      <p className="capitalize">
                        {form.watch("note").toLowerCase()}
                      </p>
                    ) : (
                      ""
                    )}
                  </p>
                </TableCell>
                <TableCell colSpan={2} className="text-muted-foreground">
                  Subtotal
                </TableCell>
                <TableCell className="text-right">
                  {form.getValues("currency_code") === PEN ? "S/." : "$"}
                  {formatWithCommas(subtotal)}
                </TableCell>
              </TableRow>
              <TableRow className="w-full col-span-2">
                <TableCell className="pl-0 max-w-32 overflow-hidden"></TableCell>
                <TableCell colSpan={2} className="text-muted-foreground">
                  Impuesto (18%)
                </TableCell>
                <TableCell className="text-right">
                  {form.getValues("currency_code") === PEN ? "S/." : "$"}
                  {formatWithCommas(taxAmount)}
                </TableCell>
              </TableRow>
              <TableRow className="w-full col-span-2">
                <TableCell className="pl-0 max-w-32 overflow-hidden"></TableCell>
                <TableCell colSpan={2} className="text-muted-foreground">
                  Total
                </TableCell>
                <TableCell className="text-right">
                  {form.getValues("currency_code") === PEN ? "S/." : "$"}
                  {formatWithCommas(totalWithTax)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </Card>
  );
}
