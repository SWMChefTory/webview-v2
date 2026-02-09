import { useCallback, useRef } from "react";
import { RiKakaoTalkFill } from "react-icons/ri";
import { ArrowLeft } from "lucide-react";
import { useCreditRechargeModalStore } from "../creditRechargeModalStore";
import { useRechargeTranslation } from "../hooks/useRechargeTranslation";
import { request, MODE } from "@/src/shared/client/native/client";
import { UNBLOCKING_HANDLER_TYPE } from "@/src/shared/client/native/unblockingHandlerType";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { completeRecharge, LimitExceededError } from "@/src/entities/balance/api/rechargeApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BALANCE_QUERY_KEY } from "@/src/entities/balance/model/useFetchBalance";

export function KakaoShareStep() {
  const { setStep, setRechargeResult, isSharing, setIsSharing } = useCreditRechargeModalStore();
  const { t } = useRechargeTranslation();
  const queryClient = useQueryClient();

  // Ref를 통한 동기적 중복 클릭 방지 (React 18 비동기 상태 업데이트로 인한 race condition 방지)
  const isSharingRef = useRef(false);

  const handleBack = useCallback(() => {
    setStep('clipboard');
  }, [setStep]);

  const openKakaoTalk = useCallback(() => {
    request(MODE.UNBLOCKING, UNBLOCKING_HANDLER_TYPE.OPEN_KAKAO);
  }, []);

  const handleKakaoShare = useCallback(async () => {
    track(AMPLITUDE_EVENT.RECHARGE_KAKAO_CLICK);

    // 더블 클릭 방지: Ref를 사용한 동기적 체크 (React 18 비동기 상태 업데이트로 인한 race condition 방지)
    if (isSharingRef.current) return;
    isSharingRef.current = true;
    setIsSharing(true);

    try {
      const result = await completeRecharge();

      // Balance 갱신
      queryClient.invalidateQueries({ queryKey: [BALANCE_QUERY_KEY] });

      // 성공 시 충전된 베리 토스트 (모달이 닫혀있어도 항상 표시)
      if (result.amount > 0) {
        toast.success(t('kakao.chargeSuccess', { amount: result.amount }), { duration: 2000 });
      }

      // 결과 저장
      setRechargeResult(result);

      // 카카오톡 실행 (성공 시)
      openKakaoTalk();

      // 성공 화면으로 전환
      setStep('success');

    } catch (error) {
      // 에러 타입별 분기 처리
      if (error instanceof LimitExceededError) {
        // 일일 횟수 초과: 카카오톡 열림 + 성공 화면 (횟수 초과 안내)
        setRechargeResult({ amount: 0, remainingCount: 0 });
        openKakaoTalk();
        setStep('success');
      } else {
        // 네트워크/서버 오류: 토스트 + 현재 화면 유지
        toast.error(t('kakao.chargeFailed'));
      }
    } finally {
      isSharingRef.current = false;
      setIsSharing(false);
    }
  }, [setStep, setRechargeResult, queryClient, setIsSharing, openKakaoTalk, t]);

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
          disabled={isSharing}
          className="w-full max-w-md py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#FEE500' }}
          aria-label={isSharing ? t('kakao.sharing') : t('kakao.shareButton')}
        >
          {isSharing ? (
            <svg className="animate-spin size-5 text-black/85" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <RiKakaoTalkFill size={20} className="text-black/85" />
          )}
          <span className="text-base font-semibold text-black/85">
            {isSharing ? t('kakao.sharing') : t('kakao.shareButton')}
          </span>
        </button>
      </div>
    </div>
  );
}
