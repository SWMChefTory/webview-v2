import { useCallback } from "react";
import { RiKakaoTalkFill } from "react-icons/ri";
import { ArrowLeft } from "lucide-react";
import { useCreditRechargeModalStore } from "../creditRechargeModalStore";
import { useRechargeTranslation } from "../hooks/useRechargeTranslation";
import { generateRechargeUrl } from "../utils/deepLink";
import { request, MODE } from "@/src/shared/client/native/client";
import { UNBLOCKING_HANDLER_TYPE } from "@/src/shared/client/native/unblockingHandlerType";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { completeRecharge, LimitExceededError } from "@/src/entities/balance/api/rechargeApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BALANCE_QUERY_KEY } from "@/src/entities/balance/model/useFetchBalance";

export function KakaoShareStep() {
  const { setStep, setRechargeResult } = useCreditRechargeModalStore();
  const { t } = useRechargeTranslation();
  const queryClient = useQueryClient();

  const handleBack = useCallback(() => {
    setStep('clipboard');
  }, [setStep]);

  const handleKakaoShare = useCallback(async () => {
    track(AMPLITUDE_EVENT.RECHARGE_KAKAO_CLICK);

    // 1. 즉시 충전 API 호출
    try {
      const result = await completeRecharge();

      // 2. Store에 결과 저장
      setRechargeResult(result);

      // 3. Balance 갱신
      queryClient.invalidateQueries({ queryKey: [BALANCE_QUERY_KEY] });

      // 4. 카카오톡 실행
      const returnUrl = generateRechargeUrl();
      request(MODE.UNBLOCKING, UNBLOCKING_HANDLER_TYPE.OPEN_KAKAO, { returnUrl });

      // 5. 성공 화면으로 전환
      setStep('success');

      toast.success(`${result.amount}베리가 충전되었어요!`, { duration: 2000 });
    } catch (error) {
      if (error instanceof LimitExceededError) {
        // 횟수 초과: 카카오톡은 열고 success로 이동 (amount: 0)
        setRechargeResult({ amount: 0, remainingCount: 0 });

        const returnUrl = generateRechargeUrl();
        request(MODE.UNBLOCKING, UNBLOCKING_HANDLER_TYPE.OPEN_KAKAO, { returnUrl });

        setStep('success');
        toast.info('오늘의 충전 횟수를 모두 사용했어요.', { duration: 3000 });
      } else {
        const message = error instanceof Error ? error.message : '충전에 실패했어요.';
        toast.error(message, { duration: 3000 });
      }
    }
  }, [setStep, setRechargeResult, queryClient]);

  return (
    <div className="flex flex-col min-h-[280px] h-full relative">
      {/* Back Button - absolute positioned so it doesn't affect centering */}
      <button
        onClick={handleBack}
        className="absolute top-0 left-0 flex items-center gap-1.5 py-1 text-gray-500 hover:text-gray-900 transition-colors z-10"
        aria-label={t('kakao.backButton')}
      >
        <ArrowLeft size={16} />
        <span className="text-sm">{t('kakao.backButton')}</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        {/* Icon */}
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
          <RiKakaoTalkFill size={40} className="text-yellow-500" />
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-lg lg:text-xl font-bold">{t('kakao.title')}</h2>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {t('kakao.description')}
          </p>
        </div>

        {/* Kakao Share Button */}
        <button
          onClick={handleKakaoShare}
          className="w-full max-w-md py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
          style={{ backgroundColor: '#FEE500' }}
          aria-label={t('kakao.shareButton')}
        >
          <RiKakaoTalkFill size={20} className="text-black/85" />
          <span className="text-base font-semibold text-black/85">{t('kakao.shareButton')}</span>
        </button>
      </div>
    </div>
  );
}
