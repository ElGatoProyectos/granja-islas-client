import { FormatedTotalAmountReceipts } from "@/hooks/useDashboard";
import { ReceiptSchemaIN } from "@/lib/validations/receipt";

export function calculateTotals({
  receipts,
  document_type,
}: {
  receipts: ReceiptSchemaIN[];
  document_type:
    | "01 - Factura"
    | "03 - Boleta de venta"
    | "07 - Nota de crédito"
    | "08 - Nota de débito";
}): FormatedTotalAmountReceipts {
  let total_documents = 0;
  let total_amount_documents = 0;
  let total_amount_igv = 0;
  let total_amount_base = 0;
  let total_amount_dgng_igv = 0;
  let total_amount_dgng_base = 0;

  for (const receipt of receipts) {
    total_documents += 1;
    total_amount_documents += receipt.total;
    total_amount_igv += receipt.igv;
    total_amount_base += receipt.amount_base;
  }

  return {
    document_type,
    total_documents,
    total_amount_documents,
    total_amount_igv,
    total_amount_base,
    total_amount_dgng_igv,
    total_amount_dgng_base,
  };
}

export function calculateTotalCards({
  formatedReceipts,
}: {
  formatedReceipts: FormatedTotalAmountReceipts[];
}) {
  let totalOfAll = 0;
  let totalAmountDocumentsOfAll = 0;
  let totalAmountBase = 0;
  let totalAmountIgv = 0;
  for (const receipt of formatedReceipts) {
    totalOfAll += receipt.total_amount_documents;
    totalAmountDocumentsOfAll += receipt.total_amount_documents;
    totalAmountBase += receipt.total_amount_base;
    totalAmountIgv += receipt.total_amount_igv;
  }
  return {
    totalOfAll,
    totalAmountDocumentsOfAll,
    totalAmountBase,
    totalAmountIgv,
  };
}
