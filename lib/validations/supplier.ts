import { z } from "zod";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1), // current page
  per_page: z.coerce.number().default(10), // rows of data
  sort: z.string().optional(), // sort A-Z
  title: z.string().optional(), // search
  status: z.string().optional(), // filters
  priority: z.string().optional(), // filters
  from: z.string().optional(), // date start
  to: z.string().optional(), // date end
  // operator: z.enum(["and", "or"]).optional(),
});

export const getSupplierSchema = searchParamsSchema;

export type GetSupplierSchema = z.infer<typeof getSupplierSchema>;

export const createSupplierSchema = z.object({
  ruc: z.string().min(1, "El RUC es obligatorio."),
  business_name: z.string().min(1, "La razón social es obligatoria."),
  business_type: z.string(),
  business_status: z.string().min(1, "El estado es obligatorio."),
  business_direction: z.string().min(1, "La dirección fiscal es obligatoria."),
  country_code: z.string(),
  phone: z.string(),
});

export type CreateSupplierSchema = z.infer<typeof createSupplierSchema>;

export const supplierSchemaIN = z.object({
  id: z.number(),
  ruc: z.string(),
  business_name: z.string(),
  business_type: z.string(),
  business_status: z.string(),
  business_direction: z.string(),
  country_code: z.string().nullable(),
  phone: z.string().nullable(),
});

export type SupplierSchemaIN = z.infer<typeof supplierSchemaIN>;

export const updateSupplierSchema = z.object({
  ruc: z.string().optional(),
  corporate_name: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  fiscal_address: z.string().optional(),
  country_code: z.string().optional(),
  phone: z.string().optional(),
});

export type UpdateSupplierSchema = z.infer<typeof updateSupplierSchema>;
