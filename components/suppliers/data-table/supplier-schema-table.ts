import { z } from "zod";

export const supplierSchemaTable = z.object({
  id: z.number(),
  ruc: z.string(),
  business_name: z.string(),
  business_type: z.string(),
  business_status: z.string(),
  business_direction: z.string(),
  phone: z.string(),
  country_code: z.string(),
});

export type SupplierTypeIn = z.infer<typeof supplierSchemaTable>;
