import { z } from "zod";
import { receiptSchemaIN } from "./receipt";
import { supplierSchemaIN } from "./supplier";
import { labelArraySchemaIN } from "./label";

export const productSchemaIN = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  amount: z.number(),
  price: z.number(),
  igv: z.number().nullable(),
  total: z.number().nullable(),
  slug: z.string(),
  unit_measure: z.string(),
  supplier_id: z.number(),
  issue_date: z.string(),
  document_type: z.string(),
  document_id: z.number(),
  status_deleted: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  Supplier: supplierSchemaIN,
});

export const productTableReport = z.object({
  document: receiptSchemaIN.omit({ Supplier: true }),
  product: productSchemaIN,
});
export type ProductTableReport = z.infer<typeof productTableReport>;

export const productTableArrayReportIN = z.array(productTableReport);

export const productArraySchemaIN = z.array(productSchemaIN);
export type ProductSchemaIN = z.infer<typeof productSchemaIN>;

/* falta terminar */
export function formatProductTable(data: ProductTableReport[]) {
  return data.map(({ document, product }) => {
    return {
      document_code: document.document_code,
      code: document.code,
      ...product,
    };
  });
}

export const productSchemaINFormated = productSchemaIN.extend({
  document_code: z.string(),
  code: z.string(),
});

export const productSchemaArrayINFormated = z.array(productSchemaINFormated);
export type ProductSchemaINFormated = z.infer<typeof productSchemaINFormated>;

/* product details */

export const productDetailSchemaIN = z.object({
  product: productSchemaIN.omit({ Supplier: true }),
  supplier: supplierSchemaIN,
  labels: labelArraySchemaIN,
  document: receiptSchemaIN.omit({ Supplier: true }),
});

export type ProductDetailSchemaIN = z.infer<typeof productDetailSchemaIN>;

// {
//     product: {
//       id: 163,
//       title: 'CORTAR Y ENDEREZAR DOS PUNTAS DE FUNDA.',
//       description: '',
//       amount: 1,
//       price: 200,
//       igv: null,
//       slug: 'cortar-y-enderezar-dos-puntas-de-funda.',
//       unit_measure: 'UNIDAD',
//       supplier_id: 39,
//       document_type: 'BILL',
//       document_id: 103,
//       status_deleted: false,
//       created_at: '2024-08-08T00:00:00.000Z',
//       updated_at: '2024-08-08T21:32:21.849Z'
//     },
//     supplier: {
//       id: 39,
//       company_id: 1,
//       user_id_created: 2,
//       business_name: 'TALLER DE MECANICA TORNO PIANTO',
//       business_type: 'E.I.R.L.',
//       business_status: 'ACTIVO',
//       business_direction:
//         'JR. CHINCHA NRO. 1241      SAN ISIDRO ICA - CHINCHA - PUEBLO NUEVO',
//       description: '',
//       ruc: '20605072888',
//       status_deleted: false,
//       phone: '996809792',
//       country_code: '+51',
//       created_at: '2024-08-08T00:00:00.000Z',
//       updated_at: '2024-08-08T22:37:33.150Z'
//     },
//     labels: [
//       {
//         id: 4,
//         company_id: 1,
//         user_created_id: 2,
//         title: 'Trigo',
//         slug: 'trigo',
//         description: null,
//         status_deleted: false
//       }
//     ],
//     document: {
//       id: 103,
//       company_id: 1,
//       user_id_created: 2,
//       num_serie: 'E001',
//       document_code: '01',
//       document_description: 'FACTURA',
//       num_cpe: 63,
//       code: 'E001-63',
//       issue_date: '2024-07-31T00:00:00.000Z',
//       expiration_date: null,
//       period: '2024-07',
//       amount_base: 745,
//       igv: 134.1,
//       total: 879.1,
//       amount_paid: 0,
//       amount_pending: 0,
//       created_status: 'SUNAT',
//       bill_status: 'ACTIVO',
//       bill_status_payment: 'CONTADO',
//       supplier_id: 39,
//       currency_code: 'PEN',
//       exchange_rate: 3.74,
//       created_at: '2024-08-08T00:00:00.000Z',
//       updated_at: '2024-08-08T21:32:21.042Z'
//     }
//   }
