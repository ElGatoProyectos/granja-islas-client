import { ReceiptSchemaIN } from "@/lib/validations/receipt";
import { FormatedTotalAmountReceipts } from "@/types/dashboard";

export function calculateTotals({
  receipts,
  document_type,
  href,
}: {
  receipts?: ReceiptSchemaIN[];
  document_type:
    | "01 - Factura"
    | "08 - Nota de débito"
    | "07 - Nota de crédito"
    | "14 - Servicios";
  href: string;
}): FormatedTotalAmountReceipts {
  let total_documents = 0;
  let total_amount_documents = 0;
  let total_amount_igv = 0;
  let total_amount_base = 0;
  let total_amount_dgng_igv = 0;
  let total_amount_dgng_base = 0;
  if (!receipts)
    return {
      document_type,
      total_documents,
      href,
      total_amount_documents,
      total_amount_igv,
      total_amount_base,

      total_amount_dgng_igv,
      total_amount_dgng_base,
    };

  for (const receipt of receipts) {
    total_documents += 1;

    total_amount_documents += receipt.total;
    total_amount_igv += receipt.igv;
    total_amount_base += receipt.amount_base;
  }

  total_amount_documents = Number(total_amount_documents.toFixed(2));
  total_amount_igv = Number(total_amount_igv.toFixed(2));
  total_amount_base = Number(total_amount_base.toFixed(2));

  return {
    document_type,
    href,
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
    totalOfAll += receipt.total_documents;
    totalAmountDocumentsOfAll += receipt.total_amount_documents;
    totalAmountBase += receipt.total_amount_base;
    totalAmountIgv += receipt.total_amount_igv;
  }

  totalOfAll = Number(totalOfAll.toFixed(2));
  totalAmountIgv = Number(totalAmountIgv.toFixed(2));
  totalAmountBase = Number(totalAmountBase.toFixed(2));

  return {
    totalOfAll,
    totalAmountDocumentsOfAll,
    totalAmountBase,
    totalAmountIgv,
  };
}
