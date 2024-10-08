import { z } from "zod";
import { labelArraySchemaIN, labelSchemaIN } from "./label";
import { receiptArraySchemaIN } from "./receipt";

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

const supplierSchemaFilter = z.object({
  id: z.number(),
  business_name: z.string(),
  ruc: z.string(),
  business_direction: z.string(),
});
export const supplierArraySchemaFilter = z.array(supplierSchemaFilter);
export type SupplierSchemaFilter = z.infer<typeof supplierSchemaFilter>;

/* products of supplier */

const supplierProductsSchema = z.object({
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
  DetailProductLabel: z.array(
    z.object({
      id: z.number(),
      product_id: z.number(),
      product_label_id: z.number(),
      created_at: z.string(),
      updated_at: z.string(),
      Label: z.object({
        id: z.number(),
        company_id: z.number(),
        user_created_id: z.number(),
        title: z.string(),
        slug: z.string(),
        description: z.string().nullable(),
        status_deleted: z.boolean(),
      }),
    })
  ),
  document: z.object({
    id: z.number(),
    company_id: z.number(),
    user_id_created: z.number(),
    num_serie: z.string(),
    document_code: z.string(),
    document_description: z.string(),
    amount_base: z.number(),
    amount_paid: z.number(),
    amount_pending: z.number(),
    bill_status: z.string(),
    bill_status_payment: z.string(),
    code: z.string(),
    currency_code: z.string(),
    exchange_rate: z.number(),
    created_status: z.string(),
    note: z.string().nullable(),
    expiration_date: z.string().nullable(),
    igv: z.number(),
    issue_date: z.string().datetime(),
    num_cpe: z.number(),
    period: z.string(),
    supplier_id: z.number(),
    total: z.number(),
  }),
});
export const supplierProductsArraySchema = z.array(supplierProductsSchema);
export type SupplierProductsSchema = z.infer<typeof supplierProductsSchema>;

export const formatSupplierProducts = (data: SupplierProductsSchema[]) => {
  return data.map((supplierProduct) => {
    return {
      ...supplierProduct,
      DetailProductLabel: supplierProduct.DetailProductLabel.map((label) => ({
        label: label.Label.title,
      })),
      code: supplierProduct.document.code,
      issue_date: supplierProduct.document.issue_date,
    };
  });
};

export const supplierProductsFormatSchema = z.object({
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
  document_type: z.string(),
  document_id: z.number(),
  status_deleted: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  DetailProductLabel: z.array(z.object({ label: z.string() })),
  code: z.string(),
  issue_date: z.string().datetime(),
});

export const supplierProductsArrayFormatSchema = z.array(
  supplierProductsFormatSchema
);

export type SupplierProductsFormatSchema = z.infer<
  typeof supplierProductsFormatSchema
>;
