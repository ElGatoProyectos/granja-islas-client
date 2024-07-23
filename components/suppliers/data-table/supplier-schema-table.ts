import { z } from "zod";

export const supplierSchemaTable = z.object({
  id: z.string(),
  ruc: z.string(),
  corporate_name: z.string(),
  type: z.string(),
  status: z.string(),
  fiscal_address: z.string(),
  country_code: z.string(),
  phone: z.string(),
});

export type Supplier = z.infer<typeof supplierSchemaTable>;
