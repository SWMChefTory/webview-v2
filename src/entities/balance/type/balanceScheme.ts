import z from "zod";

export const SHARE_LIMIT = 3;
export const CREDIT_PER_SHARE = 10;

export const BalanceSchema = z.object({
  balance: z.number(),
  remainingRechargeCount: z.number().default(SHARE_LIMIT),
});

// 백엔드 POST /api/v1/users/share 응답용 스킴
// 백엔드: { "share_count": 1 } → Axios interceptor가 camelCase로 변환
export const ShareResponseSchema = z.object({
  shareCount: z.number().min(1).max(SHARE_LIMIT),
});

export type BalanceDto = z.infer<typeof BalanceSchema>;
export type ShareResponseDto = z.infer<typeof ShareResponseSchema>;