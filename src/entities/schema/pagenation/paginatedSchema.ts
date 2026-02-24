import { z } from "zod";

export const createCursorPaginatedSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    nextCursor: z.string().nullable(),
    hasNext: z.boolean(),
    data: dataSchema,
  });

