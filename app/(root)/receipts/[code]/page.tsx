"use client";

import { LayerPage } from "@/components/layer-page";
import { PaymentForm } from "@/components/receipts/details/payment-form";
import { PaymentsTable } from "@/components/receipts/details/payments-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CONTADO } from "@/constants/type-payments";
import { useReceiptDetail } from "@/hooks/useReceiptDetails";
import { useReceiptPayment } from "@/hooks/useReceiptPayment";
import { formatDate } from "@/utils/format-date";
import { formatWithCommas } from "@/utils/format-number-comas";
import { useParams } from "next/navigation";

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
                {CONTADO === receipt.bill_status_payment ? null : (
                  <>
                    <div className="flex justify-between">
                      <span>Pagado</span>
                      <p className="text-muted-foreground">
                        {receipt.amount_paid}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <span>Pendiente</span>
                      <p className="text-muted-foreground">
                        {receipt.amount_pending}
                      </p>
                    </div>
                  </>
                )}
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
            <Skeleton className="w-full h-[210px]" />
            <Skeleton className="w-full h-[210px]" />
          </main>
        </div>
      )}

      <footer className="mt-6 flex gap-6">
        <Card className="w-2/4">
          <CardHeader>
            <CardTitle>Cargar pago</CardTitle>
            <CardDescription>
              Utiliza esta sección para registrar un nuevo pago. Asegúrate de
              que la información sea precisa para mantener un registro exacto de
              tus pagos.
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
              registrado. Aquí encontrarás el monto de cada pago y una foto del
              comprobante (voucher) correspondiente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentsTable receiptPayments={receiptPayments} />
          </CardContent>
        </Card>
      </footer>
    </LayerPage>
  );
}
