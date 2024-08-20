import { z } from "zod";

export const principalSuppliersSchema = z.array(
  z.object({
    ruc: z.string(),
    business_name: z.string(),
    total: z.number(),
  })
);
export type PrincipalSuppliersSchema = z.infer<typeof principalSuppliersSchema>;

export const buyForMonthSchema = z.object({
  enero: z.number(),
  febrero: z.number(),
  marzo: z.number(),
  abril: z.number(),
  mayo: z.number(),
  junio: z.number(),
  julio: z.number(),
  agosto: z.number(),
  septiembre: z.number(),
  octubre: z.number(),
  noviembre: z.number(),
  diciembre: z.number(),
});
export type BuyForMonthSchema = z.infer<typeof buyForMonthSchema>;

export const analyticsSchemaIN = z.object({
  principalSuppliers: principalSuppliersSchema,
  buyForMonth: buyForMonthSchema,
});
export type AnalyticsSchemaIN = z.infer<typeof analyticsSchemaIN>;

/* general analitycs */

export const topSuppliersSchemaIN = z.object({
  ruc: z.string(),
  business_name: z.string(),
  total: z.number(),
});
export const topSuppliersArraySchemaIN = z.array(topSuppliersSchemaIN);
export type TopSuppliersSchemaIN = z.infer<typeof topSuppliersSchemaIN>;

/* expenditure compositon */

export const expCompositonSchemaIN = z.object({
  label: z.string(),
  total: z.number(),
});
export const expCompositonArraySchemaIN = z.array(expCompositonSchemaIN);
export type ExpCompositonSchemaIN = z.infer<typeof expCompositonSchemaIN>;

/* spesfiic */
export const specificSchemaIN = z.object({
  month: z.string(),
  amount: z.number(),
  average: z.number(),
});
export const specificArraySchemaIN = z.array(specificSchemaIN);
export type SpecificSchemaIN = z.infer<typeof specificSchemaIN>;

export const specific3SchemaIN = z.object({
  id: z.number(),
  company_id: z.number(),
  user_id_created: z.number(),
  num_serie: z.string(),
  document_code: z.string(),
  document_description: z.string(),
  num_cpe: z.number(),
  code: z.string(),
  issue_date: z.string().datetime(),
  expiration_date: z.string().nullable(),
  period: z.string(),
  amount_base: z.number(),
  igv: z.number(),
  total: z.number(),
  amount_paid: z.number(),
  amount_pending: z.number(),
  created_status: z.string(),
  bill_status: z.string(),
  bill_status_payment: z.string(),
  supplier_id: z.number(),
  currency_code: z.string(),
  exchange_rate: z.number(),
});
export const specific3ArraySchemaIN = z.array(specific3SchemaIN);
export type Specific3SchemaIN = z.infer<typeof specific3SchemaIN>;
