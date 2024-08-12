import { z } from "zod";

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
