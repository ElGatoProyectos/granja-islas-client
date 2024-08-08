import { z } from "zod";
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createPaymentSchema = z.object({
  bank_id: z.string(),
  operation_number: z.string(),
  type_currency: z.enum(["PEN", "USD"]),
  amount_original: z.string(),
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
});
export const paymentReceiptArraySchemaIN = z.array(paymentReceiptSchemaIN);
export type PaymentReceiptSchemaIN = z.infer<typeof paymentReceiptSchemaIN>;
