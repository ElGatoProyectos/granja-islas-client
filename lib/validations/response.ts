import { z } from "zod";

export const responseArraySchema = z.object({
  error: z.boolean(),
  message: z.string(),
  statusCode: z.number(),
  payload: z.array(z.any()),
});

export type ResponseArraySchema = z.infer<typeof responseArraySchema>;

export const responseSchema = z.object({
  error: z.boolean(),
  message: z.string(),
  statusCode: z.number(),
  payload: z.any(),
});

export type ResponseSchema = z.infer<typeof responseSchema>;
