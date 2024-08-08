import { z } from "zod";

export const paginationSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  pageCount: z.number(),
  data: z.array(z.any()),
});

export type PaginationSchema = z.infer<typeof paginationSchema>;
