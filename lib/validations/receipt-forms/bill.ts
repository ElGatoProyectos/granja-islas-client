import { PEN, USD } from "@/constants/currency";
import { CONTADO, CREDITO } from "@/constants/type-payments";
import { z } from "zod";

export const billSchemaCreate = z.object({
  code: z.string().min(1, "El Nro. de factura es obligatorio"),
  issue_date: z.date({
    required_error: "La fecha de emisión es obligatoria",
  }), // emision
  expiration_date: z
    .date({
      required_error: "La fecha de vencimiento es obligatoria",
    })
    .optional(), // vencimiento
  supplier_id: z.string().min(1, "El proveedor es obligatorio"), // id de proveedor
  igv: z.string(),
  bill_status_payment: z.enum([CONTADO, CREDITO]),
  note: z.string(),
  currency_code: z.enum([USD, PEN]), // Moneda
  exchange_rate: z.number().optional(), // tipo de cambio
  products: z.array(
    z.object({
      title: z.string(),
      amount: z.string(), // quantity
      unit_measure: z.string(),
      price: z.string(),
    })
  ),
});

export type BillSchemaCreate = z.infer<typeof billSchemaCreate>;

export const creditNoteSchemaCreate = z.object({
  code: z.string().min(1, "El Nro. de nota de credito es obligatorio"),
  document_id: z.string(),
  issue_date: z.date({
    required_error: "La fecha de emisión es obligatoria",
  }), // emision
  expiration_date: z
    .date({
      required_error: "La fecha de vencimiento es obligatoria",
    })
    .optional(), // vencimiento
  supplier_id: z.string().min(1, "El proveedor es obligatorio"), // id de proveedor
  igv: z.string(),
  bill_status_payment: z.enum([CONTADO, CREDITO]),
  note: z.string(),
  currency_code: z.enum([USD, PEN]), // Moneda
  exchange_rate: z.number().optional(), // tipo de cambio
  products: z.array(
    z.object({
      title: z.string(),
      amount: z.string(), // quantity
      unit_measure: z.string(),
      price: z.string(),
    })
  ),
});

export type CreditNoteSchemaCreate = z.infer<typeof creditNoteSchemaCreate>;
