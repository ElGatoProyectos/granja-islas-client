import { ReceiptSchemaIN } from "@/lib/validations/receipt";

export interface TypeDashboard {
  bills: ReceiptSchemaIN[];
  creditNotes: ReceiptSchemaIN[];
  debitNotes: ReceiptSchemaIN[];
  tickets: ReceiptSchemaIN[];
}

export interface FormatedTotalAmountReceipts {
  document_type:
    | "01 - Factura"
    | "14 - Servicios"
    | "07 - Nota de crédito"
    | "08 - Nota de débito";
  total_documents: number;
  total_amount_documents: number;
  total_amount_igv: number;
  total_amount_base: number;
  total_amount_dgng_igv: number;
  total_amount_dgng_base: number;
  href: string;
}
