import { z } from "zod";

export const bankSchemaIN = z.object({
  company_id: z.number(),
  description: z.string().nullable(),
  id: z.number(),
  slug: z.string(),
  status_deleted: z.boolean(),
  title: z.string(),
  user_created_id: z.number(),
});

export type BankSchemaIN = z.infer<typeof bankSchemaIN>;
