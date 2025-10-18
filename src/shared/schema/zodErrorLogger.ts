import { z } from "zod";

export function parseWithErrLog<T>(schema: z.ZodSchema<T>, value: unknown): T {
  try {
    console.log("try parseWithErrLog");
    return schema.parse(value);
  } catch (error) {
    console.log("[ZOD ERROR VALUE] : ",JSON.stringify(value, null, 2));
    throw error;
  }
}
