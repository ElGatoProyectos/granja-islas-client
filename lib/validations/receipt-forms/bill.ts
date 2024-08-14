import { z } from "zod";

export const billSchemaCreate = z.object({
  comprobante: z.string(),
  proveedor: z.string(),
  fecha_emision: z.string(),
  impuestos: z.string(),
  tipo_pago: z.string(),
  vencimiento: z.string(),

  notas: z.string(),
  moneda: z.string(),
  tipo_cambio: z.string(),
  productos: z.array(
    z.object({
      name: z.string(),
      cantidad: z.string(),
      medida: z.string(),
      precio: z.string(),
    })
  ),
});

export type BillSchemaCreate = z.infer<typeof billSchemaCreate>;
