import z from "zod";

export const BalanceSchema = z.object({
  balance: z.number(),
  remainingRechargeCount: z.number().default(10),
});

export type BalanceDto = z.infer<typeof BalanceSchema>;