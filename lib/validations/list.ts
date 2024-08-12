import { z } from "zod";
import { supplierSchemaIN } from "./supplier";
export const listsSchemaIN = z.object({
  label_id: z.number(),
  label: z.string(),
  lastPurchaseDate: z.string(),
  currencyCode: z.string(),
  lastPrice: z.number(),
  averagePrice: z.number(),
  lowestPrice: z.number(),
  supplier: supplierSchemaIN,
});

export const listsArraySchemaIN = z.array(listsSchemaIN);

export type ListsSchemaIN = z.infer<typeof listsSchemaIN>;
