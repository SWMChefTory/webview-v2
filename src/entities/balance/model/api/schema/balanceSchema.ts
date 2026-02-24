import z from "zod";

export const SHARE_LIMIT = 3;
export const CREDIT_PER_SHARE = 10;

export const BalanceSchema = z.object({
  balance: z.number(),
  remainingRechargeCount: z.number().default(SHARE_LIMIT),
});

export type Balance = z.infer<typeof BalanceSchema>;
// 백엔드 POST /api/v1/users/share 응답용 스킴
// 백엔드: { "share_count": 1 } → Axios interceptor가 camelCase로 변환
// min(0)으로 설정하여 엣지 케이스(공유 취소, 롤백 등)에 대비한 방어적 스키마
export const ShareResponseSchema = z.object({
  shareCount: z.number().min(0).max(SHARE_LIMIT),
});
