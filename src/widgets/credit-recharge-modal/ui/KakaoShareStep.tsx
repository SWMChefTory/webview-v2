import { useCallback, useEffect } from "react";
import { RiKakaoTalkFill } from "react-icons/ri";
import { ArrowLeft } from "lucide-react";
import { useCreditRechargeModalStore } from "../creditRechargeModalStore";
import { useRechargeTranslation } from "../hooks/useRechargeTranslation";
import { request, MODE } from "@/src/shared/client/native/client";
import { UNBLOCKING_HANDLER_TYPE } from "@/src/shared/client/native/unblockingHandlerType";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useRechargeBalance, LimitExceededError } from "@/src/entities/balance";
import { toast } from "sonner";

export function KakaoShareStep() {
  const { setStep, setRechargeResult, setIsSharing } = useCreditRechargeModalStore();
  const { t } = useRechargeTranslation();

  const openKakaoTalk = useCallback(() => {
    request(MODE.UNBLOCKING, UNBLOCKING_HANDLER_TYPE.OPEN_KAKAO);
  }, []);

  const { rechargeBalance, isPending } = useRechargeBalance({
    onSuccess: (data) => {
      // 성공 시 충전된 베리 토스트
      if (data.amount > 0) {
        toast.success(t('kakao.chargeSuccess', { amount: data.amount }), { duration: 2000 });
      }
      setRechargeResult(data);
      openKakaoTalk();
      setStep('success');
    },
    onError: (error) => {
      if (error instanceof LimitExceededError) {
        // 일일 횟수 초과: 카카오톡 열림 + 성공 화면 (횟수 초과 안내)
        setRechargeResult({ amount: 0, remainingCount: 0 });
        openKakaoTalk();
        setStep('success');
      } else {
        // 네트워크/서버 오류: 토스트 + 현재 화면 유지
        toast.error(t('kakao.chargeFailed'));
      }
    },
  });

  // isPending을 store의 isSharing과 동기화 (모달 닫기 방지용)
  useEffect(() => {
    setIsSharing(isPending);
  }, [isPending, setIsSharing]);

  const handleBack = useCallback(() => {
    setStep('clipboard');
  }, [setStep]);

  const handleKakaoShare = useCallback(() => {
    track(AMPLITUDE_EVENT.RECHARGE_KAKAO_CLICK);
    rechargeBalance();
  }, [rechargeBalance]);

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
          disabled={isPending}
          className="w-full max-w-md py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#FEE500' }}
          aria-label={isPending ? t('kakao.sharing') : t('kakao.shareButton')}
        >
          {isPending ? (
            <svg className="animate-spin size-5 text-black/85" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <RiKakaoTalkFill size={20} className="text-black/85" />
          )}
          <span className="text-base font-semibold text-black/85">
            {isPending ? t('kakao.sharing') : t('kakao.shareButton')}
          </span>
        </button>
      </div>
    </div>
  );
}
