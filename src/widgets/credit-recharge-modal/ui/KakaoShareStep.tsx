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

export function KakaoShareStep() {
  const { setStep } = useCreditRechargeModalStore();
  const { t } = useRechargeTranslation();

  const handleBack = useCallback(() => {
    setStep('clipboard');
  }, [setStep]);

  const handleKakaoShare = useCallback(() => {
    track(AMPLITUDE_EVENT.RECHARGE_KAKAO_CLICK);

    // 1. sessionStorage에 timestamp 저장 (5분 유효)
    sessionStorage.setItem('rechargeTimestamp', Date.now().toString());

    // 2. 복귀용 URL 생성
    const returnUrl = generateRechargeUrl();

    // 3. 카카오톡 앱 실행 (네이티브에서 플랫폼별 스킴 처리)
    request(MODE.UNBLOCKING, UNBLOCKING_HANDLER_TYPE.OPEN_KAKAO, {
      returnUrl,
    });

    // 4. 바로 SuccessStep으로 이동 (모달은 닫지 않음)
    setStep('success');
  }, [setStep]);

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
