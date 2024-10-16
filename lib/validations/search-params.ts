import { z } from "zod";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  startYear: z.coerce.number().optional().default(currentYear),
  startMonth: z.coerce.number().optional().default(currentMonth),
  endYear: z.coerce.number().optional().default(currentYear),
  endMonth: z.coerce.number().optional().default(currentMonth),
  num_serie: z.string().optional(),
  supplier_name: z.string().optional(),
  document_description: z.string().optional(),
  bill_status_payment: z.string().optional(),
  ruc: z.string(),
});

export const getReceiptsSchema = searchParamsSchema;
export type GetReceiptsSchema = z.infer<typeof getReceiptsSchema>;

export const searchParamsProductsSchema = z.object({
  ruc: z.string(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  startYear: z.coerce.number().optional().default(currentYear),
  startMonth: z.coerce.number().optional().default(currentMonth),
  endYear: z.coerce.number().optional().default(currentYear),
  endMonth: z.coerce.number().optional().default(currentMonth),
  title: z.string().optional(),
  supplier_name: z.string().optional(),
  labels: z.string().optional(),
});
export const getProductsSchema = searchParamsProductsSchema;
export type GetProductsSchema = z.infer<typeof getProductsSchema>;
