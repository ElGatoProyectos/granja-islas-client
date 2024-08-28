import { z } from "zod";

const notificationSchema = z.object({
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
  date: z.string(), // O bien `z.date()` si prefieres manejarlo como un objeto Date
  status: z.string(),
  status_deleted: z.boolean(),
  color: z.string(),
  creditNoteId: z.nullable(z.number()), // o `z.union([z.number(), z.null()])`
  debitNoteId: z.nullable(z.number()), // o `z.union([z.number(), z.null()])`
  ticketId: z.nullable(z.number()), // o `z.union([z.number(), z.null()])`
});
export type NotificationSchema = z.infer<typeof notificationSchema>;

export const notificationsSchemaIN = z.object({
  message: z.string(),
  payload: z.array(notificationSchema),
});
export type NotificationsSchemaIN = z.infer<typeof notificationsSchemaIN>;
