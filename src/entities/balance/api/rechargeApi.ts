/**
 * Recharge API for completing credit recharge after KakaoTalk share
 */

export interface RechargeResponse {
  amount: number;
  balance: number;
  remainingCount: number;
  message?: string;
}

export async function completeRecharge(): Promise<RechargeResponse> {
  // sessionStorage에서 남은 횟수 읽기
  const currentCount = parseInt(
    sessionStorage.getItem('remainingRechargeCount') ?? '10',
    10
  );

  if (currentCount <= 0) {
    throw new Error('충전 횟수를 모두 사용했습니다.');
  }

  const newCount = currentCount - 1;
  sessionStorage.setItem('remainingRechargeCount', newCount.toString());

  // 개발 환경: 모의 처리
  if (process.env.NODE_ENV === 'development') {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      amount: 10,
      balance: 1500,
      remainingCount: newCount,
      message: '충전이 완료되었습니다 (모의)',
    };
  }

  // 프로덕션: API 완성 전까지 임시 모의 처리
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    amount: 10,
    balance: 1400,
    remainingCount: newCount,
    message: '충전이 완료되었습니다 (임시)',
  };
}
