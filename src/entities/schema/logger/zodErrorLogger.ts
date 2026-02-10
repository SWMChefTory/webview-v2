import { z } from "zod";

export function parseWithErrLog<T>(schema: z.ZodSchema<T>, value: unknown): T {
  try {
    return schema.parse(value);
  } catch (error) {
    throw error;
  }
}
