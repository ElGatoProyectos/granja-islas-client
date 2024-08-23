import { z } from "zod";

// {
//     "code": "FA-30",
//     "issue_date": "2024-08-05T04:14:10.068Z",
//     "expiration_date": "2024-08-05T14:54:51.442Z",
//     "period": "2024-07",
//     "bill_status_payment": "CREDITO",
//     "currency_code": "USD",
//     "exchange_rate": 3.74,
//     "supplier_id": 1,
//     "products": [
//         {
//             "title": "bloqueador",
//             "amount": 6,
//             "price": 8.5,
//             "unit_measure": "UND",
//             "supplier_id": 1
//         },
//         {
//             "title": "jabon",
//             "amount": 4,
//             "price": 11.5,
//             "unit_measure": "UND",
//             "supplier_id": 1
//         }
//     ]
// }

export const billSchemaCreate = z.object({
  code: z.string().min(1, "El Nro. de factura es obligatorio"),
  issue_date: z.date({
    required_error: "La fecha de emisión es obligatoria",
  }), // emision
  expiration_date: z.date({
    required_error: "La fecha de vencimiento es obligatoria",
  }), // vencimiento
  supplier_id: z.string().min(1, "El proveedor es obligatorio"), // id de proveedor
  impuestos: z.string(),
  tipo_pago: z.string(),

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
