import { z } from "zod";
import { receiptSchemaIN } from "./receipt";
import { supplierSchemaIN } from "./supplier";
import { formatWithCommas } from "@/utils/format-number-comas";
import { formatDate } from "@/utils/format-date";

export const labelSchemaIN = z.object({
  id: z.number(),
  company_id: z.number(),
  user_created_id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  status_deleted: z.boolean(),
});

export const labelArraySchemaIN = z.array(labelSchemaIN);
export type LabelSchemaIN = z.infer<typeof labelSchemaIN>;

/* documents of label */

export const documentsOfLabel = z.object({
  Document: receiptSchemaIN.omit({ Supplier: true }),
  Supplier: supplierSchemaIN.omit({}),
  amount: z.number(),
  created_at: z.string(),
  description: z.string(),
  document_id: z.number(),
  document_type: z.string(),
  id: z.number(),
  igv: z.number().nullable(),
  price: z.number(),
  slug: z.string(),
  status_deleted: z.boolean(),
  supplier_id: z.number(),
  title: z.string(),
  total: z.number().nullable(),
  unit_measure: z.string(),
  updated_at: z.string(),
});

export const documentsArrayOfLabel = z.array(documentsOfLabel);
export type DocumentsOfLabel = z.infer<typeof documentsOfLabel>;

export function formatDocumentsOfLabel(data: DocumentsOfLabel[]) {
  return data.map(({ Document, Supplier, price }) => {
    return {
      document_id: Document.id,
      document_code: Document.document_code,
      issue_date: formatDate(Document.issue_date),
      code: Document.code,
      ruc: Supplier.ruc,
      business_name: Supplier.business_name,
      id_supplier: Supplier.id,
      currency_code: Document.currency_code,
      price: formatWithCommas(price),
    };
  });
}

export const documentsOfLabelType = z.object({
  document_id: z.number(),
  document_code: z.string(),
  issue_date: z.string(),
  code: z.string(),
  ruc: z.string(),
  business_name: z.string(),
  id_supplier: z.number(),
  currency_code: z.string(),
  price: z.string(),
});
export type FormatDocumentsOfLabelType = z.infer<typeof documentsOfLabelType>;
