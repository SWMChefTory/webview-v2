import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreditRechargeModalStore } from "../creditRechargeModalStore";
import { completeRecharge } from "@/src/entities/balance/api/rechargeApi";
import { BALANCE_QUERY_KEY } from "@/src/entities/balance/model/useFetchBalance";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { toast } from "sonner";
import { useRechargeTranslation } from "../hooks/useRechargeTranslation";

const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export function useRechargeSession() {
  const { setStep, open } = useCreditRechargeModalStore();
  const queryClient = useQueryClient();
  const { t } = useRechargeTranslation();

  const handleRechargeComplete = useCallback(async () => {
    // 1. sessionStorage 확인 (5분 이내?)
    const timestamp = sessionStorage.getItem('rechargeTimestamp');
    if (!timestamp) return;

    // Validate timestamp is a valid number
    const timestampNum = parseInt(timestamp, 10);
    if (isNaN(timestampNum)) {
      sessionStorage.removeItem('rechargeTimestamp');
      return;
    }

    const elapsed = Date.now() - timestampNum;
    if (elapsed > SESSION_TIMEOUT_MS) {
      sessionStorage.removeItem('rechargeTimestamp');
      return;
    }

    // 2. 백엔드 API 호출
    try {
      const result = await completeRecharge();
      track(AMPLITUDE_EVENT.RECHARGE_COMPLETE, { amount: result.amount });

      // SuccessStep에서 사용할 수 있도록 sessionStorage에 결과 저장
      sessionStorage.setItem('lastRechargeResult', JSON.stringify({
        amount: result.amount,
        remainingCount: result.remainingCount,
      }));

      // 3. Balance query 무효화 (fresh data fetch)
      queryClient.invalidateQueries({ queryKey: [BALANCE_QUERY_KEY] });

      // 4. 모달 열고 성공 스텝으로 전환
      open('settings'); // source는 상관없음, 이미 모달이 열려있으면 상태만 변경됨
      setStep('success');

      toast.success(`${result.amount}베리가 충전되었어요!`);
    } catch (error) {
      console.error('Recharge complete failed:', error);
      track(AMPLITUDE_EVENT.RECHARGE_ERROR, { error: String(error) });
      toast.error(t('success.error'));
    }

    // 5. 세션 정리
    sessionStorage.removeItem('rechargeTimestamp');
  }, [setStep, open, queryClient, t]);

  useEffect(() => {
    // visibilitychange 이벤트 핸들러 (네이티브 복귀 감지)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timestamp = sessionStorage.getItem('rechargeTimestamp');
        if (timestamp) {
          handleRechargeComplete();
        }
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 정리 함수
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleRechargeComplete]);
}
