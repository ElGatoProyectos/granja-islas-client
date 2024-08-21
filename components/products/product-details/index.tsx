import { MultipleSelect } from "@/components/products/multiple-select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CONTADO } from "@/constants/type-receipt";
import { useProductDetails } from "@/context/sections/product-details";
import { formatDate } from "@/utils/format-date";
import { ProductLabels } from "./product-labels";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function ProductDetails() {
  const {
    productDetails,
    id_product,
    getProductDetails,
    removeLabelOfProduct,
  } = useProductDetails();

  return (
    <section className="space-y-6">
      {productDetails ? (
        <>
          <div className="ml-8 mb-6 flex">
            <h1 className="text-3xl font-bold capitalize">
              {productDetails.product.title.length > 33
                ? `${productDetails.product.title
                    .substring(0, 33)
                    .toLowerCase()}...`
                : productDetails.product.title.toLowerCase()}
            </h1>
            <div className="flex justify-end items-end mb-[6px] ml-2 gap-2">
              {productDetails.labels.map(({ id, title }) => (
                <Link key={id} href={`/dashboard/list/${id}`}>
                  <Badge className="cursor-pointer">{title}</Badge>
                </Link>
              ))}
            </div>
          </div>
          <Card>
            <CardHeader className="flex justify-around flex-row space-y-0 p-4 ">
              <div className="flex gap-x-3 h-12 md:text-base items-center">
                <span>Tipo</span>
                <Separator orientation="vertical" className="h-4" />
                <p className="text-muted-foreground capitalize">
                  {productDetails.document.document_description.toLowerCase()}
                </p>
              </div>
              <div className="flex gap-x-3 h-12 md:text-base items-center">
                <span>Número</span>
                <Separator orientation="vertical" className="h-4" />
                <p className="text-muted-foreground">
                  {productDetails.document.code}
                </p>
              </div>
              <div className="flex gap-x-3 h-12 md:text-base items-center">
                <span>Fecha de emisión</span>
                <Separator orientation="vertical" className="h-4" />
                <p className="text-muted-foreground">
                  {formatDate(productDetails.document.issue_date)}
                </p>
              </div>
              <div className="flex gap-x-3 h-12 md:text-base items-center">
                <span>Moneda</span>
                <Separator orientation="vertical" className="h-4" />
                <p className="text-muted-foreground">
                  {productDetails.document.currency_code}
                </p>
              </div>
            </CardHeader>
          </Card>
          <main className="grid grid-cols-2 gap-6">
            <Card className="row-span-2">
              <CardHeader>
                <CardTitle>Etiqueta de producto</CardTitle>
                <CardDescription>
                  Utiliza esta sección para seleccionar las etiquetas
                  previamente creadas y asignarlas a tus productos. Esto te
                  permitirá categorizar y organizar tus productos de manera
                  eficiente, facilitando su búsqueda y gestión en el sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductLabels
                  productDetails={productDetails}
                  removeLabelOfProduct={removeLabelOfProduct}
                />
                <MultipleSelect
                  id_product={id_product}
                  savedLabels={productDetails.labels}
                  getProductDetails={getProductDetails}
                />
              </CardContent>
            </Card>
            <Card className="row-span-1">
              <CardHeader>
                <CardTitle>Detalles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {productDetails.document.expiration_date ? (
                  <div className="flex justify-between">
                    <span>Fecha de vencimiento</span>
                    <p className="text-muted-foreground">expiration_date</p>
                  </div>
                ) : null}

                <div className="flex justify-between">
                  <span>Tipo de comprobante</span>
                  <p className="text-muted-foreground capitalize">
                    {productDetails.document.bill_status_payment.toLowerCase()}
                  </p>
                </div>
                <div className="flex justify-between">
                  <span>Importe total</span>
                  <p className="text-muted-foreground">
                    {productDetails.document.total}
                  </p>
                </div>
                {CONTADO ===
                productDetails.document.bill_status_payment ? null : (
                  <>
                    <div className="flex justify-between">
                      <span>Pagado</span>
                      <p className="text-muted-foreground">
                        {productDetails.document.amount_paid}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <span>Pendiente</span>
                      <p className="text-muted-foreground">
                        {productDetails.document.amount_pending}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="row-span-1">
              <CardHeader>
                <CardTitle>Proveedor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Ruc</span>
                  <p className="text-muted-foreground">
                    {productDetails.supplier.ruc}
                  </p>
                </div>
                <div className="flex justify-between">
                  <span>Razón social</span>
                  <Link
                    href={`/dashboard/suppliers/${productDetails.supplier.id}`}
                    className={`${buttonVariants({
                      variant: "link",
                    })} !p-0 !text-base !h-auto`}
                  >
                    {productDetails.supplier.business_name.toLowerCase()}
                  </Link>
                  {/* <p className="text-muted-foreground capitalize"></p> */}
                </div>
                <div className="flex justify-between">
                  <span>Domicilio fiscal</span>
                  <p className="text-muted-foreground capitalize max-w-60">
                    {productDetails.supplier.business_direction.toLowerCase()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </main>
        </>
      ) : (
        <div className="space-y-6">
          <Skeleton className="h-14 w-72" />
          <Skeleton className="h-16" />
          <div className="grid grid-cols-2 gap-6 auto-rows-[240px]">
            <Skeleton className="row-span-2" />
            <Skeleton className="row-span-1" />
            <Skeleton className="row-span-1" />
          </div>
        </div>
      )}
    </section>
  );
}
