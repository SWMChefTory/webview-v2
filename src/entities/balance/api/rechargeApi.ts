/**
 * Recharge API for completing credit recharge after KakaoTalk share
 */

import client from "@/src/shared/client/main/client";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import { ShareResponseSchema, SHARE_LIMIT, CREDIT_PER_SHARE } from "../type/balanceScheme";
import { isAxiosError } from "axios";

export interface RechargeResponse {
  amount: number;
  remainingCount: number;
}

// 백엔드 에러 코드 (UserShareErrorCode.java 참조)
const ERROR_CODES = {
  LIMIT_EXCEEDED: 'USER_SHARE_001',      // 공유 횟수 초과
  SHARE_CREATE_FAILED: 'USER_SHARE_002', // 공유 생성 실패 (동시성)
} as const;

const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.LIMIT_EXCEEDED]: '충전 횟수를 모두 사용했어요.',
  [ERROR_CODES.SHARE_CREATE_FAILED]: '공유 생성에 실패했어요. 다시 시도해주세요.',
} as const;

const DEFAULT_ERROR_MESSAGE = '충전에 실패했어요. 다시 시도해주세요.';

export async function completeRecharge(): Promise<RechargeResponse> {
  try {
    const response = await client.post("/users/share");

    // 응답 스키마 검증 (Axios interceptor가 camelCase로 변환 후 도달)
    const data = parseWithErrLog(ShareResponseSchema, response.data);

    // shareCount를 remainingCount로 변환 (총 SHARE_LIMIT회)
    const remainingCount = SHARE_LIMIT - data.shareCount;

    return {
      amount: CREDIT_PER_SHARE,
      remainingCount,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.data?.errorCode) {
      const errorCode = error.response.data.errorCode;
      const message = ERROR_MESSAGES[errorCode];

      if (message) {
        throw new Error(message);
      }
    }

    console.error('Recharge API error:', error);
    throw new Error(DEFAULT_ERROR_MESSAGE);
  }
}
