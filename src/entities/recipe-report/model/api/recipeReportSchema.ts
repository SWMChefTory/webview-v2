import { z } from "zod";

export const RecipeReportReasonSchema = z.enum([
  "INAPPROPRIATE_CONTENT",
  "MISINFORMATION",
  "LOW_QUALITY",
  "OTHER",
]);

export type RecipeReportReason = z.infer<typeof RecipeReportReasonSchema>;

export const RecipeReportRequestSchema = z.object({
  reason: RecipeReportReasonSchema,
  description: z.string().max(500).optional().nullable(),
});

export type RecipeReportRequest = z.infer<typeof RecipeReportRequestSchema>;
