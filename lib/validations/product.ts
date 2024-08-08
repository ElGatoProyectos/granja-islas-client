import { z } from "zod";

export const productSchemaIN = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  amount: z.number(),
  price: z.number(),
  slug: z.string(),
  unit_measure: z.string(),
  supplier_id: z.number(),
  document_type: z.string(),
  document_id: z.number(),
  status_deleted: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  DetailProductLabel: z.array(z.any()),
});
export const productArraySchemaIN = z.array(productSchemaIN);
export type ProductSchemaIN = z.infer<typeof productSchemaIN>;
