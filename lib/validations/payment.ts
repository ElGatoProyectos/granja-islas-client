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
  amount: z.string(),
  voucher: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Tamaño maximo de 5mb.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Solo .jpg, .jpeg, .png and .webp formatos soportados."
    ),
  tc: z.string(),
});

export const paymentSchemaIN = createPaymentSchema
  .omit({ voucher: true })
  .extend({
    id: z.number(),
  });

export const paymentArraySchemaIN = z.array(paymentSchemaIN);
export type PaymentSchemaIN = z.infer<typeof paymentSchemaIN>;
export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>;
