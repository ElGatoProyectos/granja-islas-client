import { z } from "zod";
import { bankSchemaIN } from "./bank";
import { supplierSchemaIN } from "./supplier";
import { userSchemaIN } from "./user";
import { receiptSchemaIN } from "./receipt";
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createPaymentSchema = z.object({
  bank_id: z.string().min(1, "El banco es requerido"),
  operation_number: z.string().min(1, "El número de operacion es requerido"),
  type_currency: z.enum(["PEN", "USD"]),
  amount_original: z.string().min(1, "El monto es requerido"),
  exchange_rate: z.string(),
  voucher: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Tamaño maximo de 5mb.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Solo .jpg, .jpeg, .png and .webp formatos soportados."
    ),
});

export const paymentSchemaIN = createPaymentSchema
  .omit({ voucher: true })
  .extend({
    id: z.number(),
  });

export const paymentArraySchemaIN = z.array(paymentSchemaIN);
export type PaymentSchemaIN = z.infer<typeof paymentSchemaIN>;
export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>;

/* data IN */
export const paymentReceiptSchemaIN = z.object({
  amount_converted: z.number(),
  amount_original: z.number(),
  bank_id: z.number(),
  company_id: z.number(),
  creditNoteId: z.number().nullable(),
  date: z.string(),
  debitNoteId: z.number().nullable(),
  document_code: z.string(),
  document_id: z.number(),
  exchange_rate: z.number(),
  id: z.number(),
  operation_number: z.string(),
  status: z.enum(["PENDING", "REFUSED", "APPROVED"]),
  status_deleted: z.boolean(),
  ticketId: z.number().nullable(),
  type_currency: z.string(),
  user_id_created: z.number(),
  Bank: bankSchemaIN,
});
export const paymentReceiptArraySchemaIN = z.array(paymentReceiptSchemaIN);
export type PaymentReceiptSchemaIN = z.infer<typeof paymentReceiptSchemaIN>;

/* data payment general IN */
export const paymentGeneralSchemaIN = z.object({
  id: z.number(),
  bank_id: z.number(),
  document_id: z.number(),
  document_code: z.string(),
  company_id: z.number(),
  user_id_created: z.number(),
  operation_number: z.string(),
  amount_original: z.number(),
  amount_converted: z.number(),
  type_currency: z.string(),
  exchange_rate: z.number(),
  date: z.string(),
  color: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REFUSED"]),
  status_deleted: z.boolean(),
  creditNoteId: z.number().nullable(),
  debitNoteId: z.number().nullable(),
  ticketId: z.number().nullable(),
  Bank: bankSchemaIN.omit({ user_created_id: true }),
  User: userSchemaIN,
  document: receiptSchemaIN.omit({ Supplier: true }),
});
export const paymentGeneralArraySchemaIN = z.array(paymentGeneralSchemaIN);
export type PaymentGeneralSchemaIN = z.infer<typeof paymentGeneralSchemaIN>;
