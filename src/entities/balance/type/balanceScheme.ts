import z from "zod";

export const BalanceSchema = z.object({
  balance: z.number(),
});

export type BalanceDto = z.infer<typeof BalanceSchema>;