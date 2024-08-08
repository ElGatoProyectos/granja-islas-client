import { z } from "zod";
import { supplierSchemaIN } from "./supplier";

export const receiptSchemaIN = z.object({
  amount_base: z.number(),
  amount_paid: z.number(),
  amount_pending: z.number(),
  bill_status: z.string(),
  bill_status_payment: z.string(),
  code: z.string(),
  company_id: z.number(),
  currency_code: z.string(),
  exchange_rate: z.number(),
  expiration_date: z.string().nullable(),
  id: z.number(),
  igv: z.number(),
  issue_date: z.string().datetime(),
  num_cpe: z.number(),
  num_serie: z.string(),
  period: z.string(),
  supplier_id: z.number(),
  total: z.number(),
  user_id_created: z.number(),
  document_code: z.string(),
  document_description: z.string(),
  Supplier: supplierSchemaIN,
});

export const receiptArraySchemaIN = z.array(receiptSchemaIN);

export type ReceiptSchemaIN = z.infer<typeof receiptSchemaIN>;
