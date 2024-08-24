import { PEN, USD } from "@/constants/currency";
import { CONTADO, CREDITO } from "@/constants/type-payments";
import { z } from "zod";

export const billSchemaCreate = z.object({
  code: z.string().min(1, "El Nro. de factura es obligatorio"),
  issue_date: z.date({
    required_error: "La fecha de emisión es obligatoria",
  }), // emision
  // amount_paid: z.string(), // falta esto
  expiration_date: z
    .date({
      required_error: "La fecha de vencimiento es obligatoria",
    })
    .optional(), // vencimiento
  supplier_id: z.string().min(1, "El proveedor es obligatorio"), // id de proveedor
  impuestos: z.string(), // falta impuestos
  bill_status_payment: z.enum([CONTADO, CREDITO]),
  note: z.string(),
  currency_code: z.enum([USD, PEN]), // Moneda
  exchange_rate: z.string(), // tipo de cambio
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
