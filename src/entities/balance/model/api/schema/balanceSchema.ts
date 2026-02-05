import z from "zod";

export const BalanceSchema = z.object({
  balance: z.number(),
});

export type Balance = z.infer<typeof BalanceSchema>;