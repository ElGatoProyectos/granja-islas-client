"use client";

import { LayerPage } from "@/components/layer-page";
import { PaymentForm } from "@/components/receipts/details/payment-form";
import { PaymentsTable } from "@/components/receipts/details/payments-table";
import { ProductsOfReceipt } from "@/components/receipts/details/table-products-of-receipt/products-of-receipt";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { backend_url } from "@/constants/config";
import { PEN } from "@/constants/currency";
import { typesSpanishFormat } from "@/constants/type-document";
import { CREDITO } from "@/constants/type-payments";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { useReceiptDetail } from "@/hooks/useReceiptDetails";
import { useReceiptPayment } from "@/hooks/useReceiptPayment";
import { formatDate } from "@/utils/format-date";
import { formatWithCommas } from "@/utils/format-number-comas";
import { Download, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { code } = useParams();
  const parts = code.toString().split("-");

  const { receipt } = useReceiptDetail({
    document_code: parts[1],
    document_id: parts[0],
  });

  const { receipt: receiptPayments, getReceiptPayments } = useReceiptPayment({
    document_code: parts[1],
    document_id: parts[0],
  });

  const [Loading, setLoading] = useState(false);
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const { toast } = useToast();

  function getValueFromLabel(label: string) {
    const found = typesSpanishFormat.find(
      (item) => item.label.toLowerCase() === label.toLowerCase()
    );
    return found ? found.value : "";
  }

  const getPdf = async () => {
    if (!receipt || !company) return;
    setLoading(true);

    const queryParams = new URLSearchParams();
    queryParams.append("document_id", receipt.id.toString());
    queryParams.append(
      "type_document",
      getValueFromLabel(receipt.document_description)
    );

    const url = `${backend_url}/api/documents/pdf?${queryParams}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${tokenBack}`, ruc: company?.ruc },
      });

      if (response.ok) {
        // Obtener el contenido como un Blob
        const blob = await response.blob();

        // Crear una URL para el Blob
        const blobUrl = URL.createObjectURL(blob);

        // Crear un enlace temporal para descargar el archivo
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `documento-${receipt.code}-fecha-${formatDate(
          receipt.issue_date
        )}.pdf`;
        document.body.appendChild(link);
        link.click();

        // Eliminar el enlace temporal después de la descarga
        document.body.removeChild(link);

        // Revocar la URL del Blob para liberar memoria
        URL.revokeObjectURL(blobUrl);
      } else {
        console.error("Error al obtener el PDF:", response.statusText);
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: `Ocurrio un error al crear el pdf del documento`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayerPage title="Comprobante">
      {receipt ? (
        <>
          <Card>
            <CardHeader className="flex justify-around flex-row space-y-0 p-4 ">
              <div className="flex gap-x-3 h-12 md:text-base items-center">
                <span>Tipo</span>
                <Separator orientation="vertical" className="h-4" />
                <p className="text-muted-foreground capitalize">
                  {receipt.document_description.toLowerCase()}
                </p>
                <Button
                  onClick={getPdf}
                  variant="secondary"
                  size="sm"
                  disabled={Loading}
                >
                  {Loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Descargar documento</span>
                    </>
                  )}
                </Button>
              </div>
              <div className="flex gap-x-3 h-12 md:text-base items-center">
                <span>Número</span>
                <Separator orientation="vertical" className="h-4" />
                <p className="text-muted-foreground">{receipt.code}</p>
              </div>
              <div className="flex gap-x-3 h-12 md:text-base items-center">
                <span>Fecha de emisión</span>
                <Separator orientation="vertical" className="h-4" />
                <p className="text-muted-foreground">
                  {formatDate(receipt.issue_date)}
                </p>
              </div>
              <div className="flex gap-x-3 h-12 md:text-base items-center">
                <span>Moneda</span>
                <Separator orientation="vertical" className="h-4" />
                <p className="text-muted-foreground">{receipt.currency_code}</p>
              </div>
              {receipt.currency_code !== PEN ? (
                <div className="flex gap-x-3 h-12 md:text-base items-center">
                  <span>TC</span>
                  <Separator orientation="vertical" className="h-4" />
                  <p className="text-muted-foreground">
                    {receipt.exchange_rate}
                  </p>
                </div>
              ) : null}
            </CardHeader>
          </Card>
          <main className="mt-6 flex gap-6">
            <Card className="w-2/4">
              <CardHeader>
                <CardTitle>Detalles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {receipt.expiration_date ? (
                  <div className="flex justify-between">
                    <span>Fecha de vencimiento</span>
                    <p className="text-muted-foreground">
                      {formatDate(receipt.expiration_date)}
                    </p>
                  </div>
                ) : null}

                <div className="flex justify-between">
                  <span>Tipo de Documento</span>
                  <p className="text-muted-foreground capitalize">
                    {receipt.document_description.toLowerCase()}
                  </p>
                </div>
                <div className="flex justify-between">
                  <span>Tipo de pago</span>
                  <p className="text-muted-foreground capitalize">
                    {receipt.bill_status_payment.toLowerCase()}
                  </p>
                </div>
                <div className="flex justify-between">
                  <span>Importe total</span>
                  <p className="text-muted-foreground">
                    {formatWithCommas(receipt.total)}
                  </p>
                </div>

                {CREDITO === receipt.bill_status_payment && receipt.pagos ? (
                  <>
                    <Separator />
                    {receipt.pagos.map(
                      ({
                        fecPlazoPago,
                        mtoPagoPendiente,
                        numCuotas,
                        numCuotasList,
                      }) => (
                        <div
                          key={fecPlazoPago + mtoPagoPendiente}
                          className="space-y-2"
                        >
                          <div className="flex justify-between">
                            <span>Pago pendiente</span>
                            <p className="text-muted-foreground">
                              {formatWithCommas(mtoPagoPendiente)}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <span>Fecha de plazo a pagar</span>
                            <p className="text-muted-foreground">
                              {fecPlazoPago}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <span>Número de cuotas</span>
                            <p className="text-muted-foreground">{numCuotas}</p>
                          </div>
                          <Separator />
                          <div className="flex flex-col justify-center text-center">
                            <span className="text-muted-foreground">
                              Lista de cuotas
                            </span>
                            <div>
                              {numCuotasList.map(
                                ({ fecVencimiento, mtoCuota, numcuota }) => (
                                  <div
                                    key={fecVencimiento + mtoCuota}
                                    className="space-y-1"
                                  >
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Nro. de cuota</span>
                                      <p className="text-muted-foreground">
                                        {numcuota}
                                      </p>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Mnto. de cuota</span>
                                      <p className="text-muted-foreground">
                                        {mtoCuota}
                                      </p>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Vncto. de cuota</span>
                                      <p className="text-muted-foreground">
                                        {fecVencimiento}
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </>
                ) : null}
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Proveedor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Ruc</span>
                  <p className="text-muted-foreground">
                    {receipt.Supplier.ruc}
                  </p>
                </div>
                <div className="flex justify-between">
                  <span>Razón social</span>
                  <p className="text-muted-foreground">
                    {receipt.Supplier.business_name}
                  </p>
                </div>
                <div className="flex justify-between">
                  <span>Domicilio fiscal</span>
                  <p className="text-muted-foreground">
                    {receipt.Supplier.business_direction}
                  </p>
                </div>
              </CardContent>
            </Card>
          </main>
        </>
      ) : (
        <div>
          <div>
            <Skeleton className="w-full h-20" />
          </div>
          <main className="mt-6 flex gap-6">
            <Skeleton className="w-2/4 h-[210px]" />
            <Skeleton className="w-full h-[210px]" />
          </main>
        </div>
      )}
      {receipt
        ? CREDITO === receipt.bill_status_payment &&
          receipt.pagos && (
            <div className="mt-6 flex gap-6">
              <Card className="w-2/4">
                <CardHeader>
                  <CardTitle>Cargar pago</CardTitle>
                  <CardDescription>
                    Utiliza esta sección para registrar un nuevo pago. Asegúrate
                    de que la información sea precisa para mantener un registro
                    exacto de tus pagos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentForm
                    type="create"
                    document_code={parts[1]}
                    document_id={parts[0]}
                    getReceiptPayments={getReceiptPayments}
                  />
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Pagos</CardTitle>
                  <CardDescription>
                    En esta sección, puedes visualizar todos los pagos que has
                    registrado. Aquí encontrarás el monto de cada pago y una
                    foto del comprobante (voucher) correspondiente.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentsTable receiptPayments={receiptPayments} />
                </CardContent>
              </Card>
            </div>
          )
        : null}

      {receipt && receipt.products.length ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Productos</CardTitle>
            <CardDescription>
              En esta sección, puedes ver todos los productos asociados al
              documento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductsOfReceipt products={receipt.products} />
          </CardContent>
        </Card>
      ) : (
        <Skeleton className="w-full h-[450px] mt-6" />
      )}
    </LayerPage>
  );
}
