import { z } from "zod";
import { receiptSchemaIN } from "./receipt";
import { supplierSchemaIN } from "./supplier";
import { labelArraySchemaIN } from "./label";

export const productSchemaIN = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  amount: z.number(),
  price: z.number(),
  igv: z.number().nullable(),
  total: z.number().nullable(),
  slug: z.string(),
  unit_measure: z.string(),
  supplier_id: z.number(),
  issue_date: z.string(),
  document_type: z.string(),
  document_id: z.number(),
  status_deleted: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  Supplier: supplierSchemaIN,
});

export const productDetailSchemaIN = z.object({
  product: productSchemaIN.omit({ Supplier: true }),
  supplier: supplierSchemaIN,
  labels: labelArraySchemaIN,
  document: receiptSchemaIN.omit({ Supplier: true }),
});

export type ProductDetailSchemaIN = z.infer<typeof productDetailSchemaIN>;
