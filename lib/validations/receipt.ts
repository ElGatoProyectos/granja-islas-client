import { z } from "zod";
import { supplierSchemaIN } from "./supplier";

export const receiptSchemaIN = z.object({
  amount_base: z.number(),
  amount_paid: z.number(),
  amount_pending: z.number(),
  bill_status: z.string(),
  bill_status_payment: z.string(),
  code: z.string(),
  company_id: z.number(),
  currency_code: z.string(),
  exchange_rate: z.number(),
  expiration_date: z.string().nullable(),
  id: z.number(),
  igv: z.number(),
  issue_date: z.string().datetime(),
  num_cpe: z.number(),
  num_serie: z.string(),
  period: z.string(),
  supplier_id: z.number(),
  total: z.number(),
  user_id_created: z.number(),
  document_code: z.string(),
  document_description: z.string(),
  created_status: z.string(),
  base_igv: z.number(),
  Supplier: supplierSchemaIN,
});

export const receiptArraySchemaIN = z.array(receiptSchemaIN);

export type ReceiptSchemaIN = z.infer<typeof receiptSchemaIN>;

export const receiptSchemaUniqueIN = z.object({
  amount_base: z.number(),
  amount_paid: z.number(),
  amount_pending: z.number(),
  bill_status: z.string(),
  bill_status_payment: z.string(),
  code: z.string(),
  company_id: z.number(),
  currency_code: z.string(),
  exchange_rate: z.number(),
  expiration_date: z.string().nullable(),
  id: z.number(),
  igv: z.number(),
  issue_date: z.string().datetime(),
  num_cpe: z.number(),
  num_serie: z.string(),
  period: z.string(),
  supplier_id: z.number(),
  total: z.number(),
  user_id_created: z.number(),
  document_code: z.string(),
  document_description: z.string(),
  created_status: z.string(),
  pagos: z
    .union([
      // Manejar el caso donde recibes un string '""'
      z.literal("").transform(() => []),

      // Manejar el caso donde recibes un JSON string válido
      z
        .string()
        .transform((val) => {
          try {
            // Intentar convertir el string en JSON
            return JSON.parse(val);
          } catch (error) {
            throw new Error("Invalid JSON format");
          }
        })
        .refine((val) => Array.isArray(val), {
          message: "Debe ser un array JSON o un string vacío",
        }),
    ])
    .transform((val) => {
      // Si ya es un array, aplicar validación a los objetos dentro del array
      return z
        .array(
          z.object({
            mtoPagoPendiente: z.number(),
            fecPlazoPago: z.string(),
            numCuotas: z.number(),
            numCuotasList: z.array(
              z.object({
                numcuota: z.number(),
                mtoCuota: z.number(),
                fecVencimiento: z.string(),
              })
            ),
          })
        )
        .parse(val);
    }),
  Supplier: supplierSchemaIN,
  products: z
    .array(
      z.object({
        id: z.number(),
        title: z.string(),
        description: z.string().nullable(),
        amount: z.number(),
        price: z.number(),
        igv: z.number(),
        total: z.number(),
        slug: z.string(),
        unit_measure: z.string(),
        supplier_id: z.number(),
        document_type: z.string(),
        document_id: z.number(),
        status_deleted: z.boolean(),
        issue_date: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
      })
    )
    .optional(),
});

export type ReceiptSchemaUniqueIN = z.infer<typeof receiptSchemaUniqueIN>;

export const productsOfReceiptIN = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  amount: z.number(),
  price: z.number(),
  igv: z.number(),
  total: z.number(),
  slug: z.string(),
  unit_measure: z.string(),
  supplier_id: z.number(),
  document_type: z.string(),
  document_id: z.number(),
  status_deleted: z.boolean(),
  issue_date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ProductsOfReceiptIN = z.infer<typeof productsOfReceiptIN>;
