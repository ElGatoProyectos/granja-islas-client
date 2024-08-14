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
