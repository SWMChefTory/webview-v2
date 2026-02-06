import { useCallback } from "react";
import { RiKakaoTalkFill } from "react-icons/ri";
import { ArrowLeft } from "lucide-react";
import { useCreditRechargeModalStore } from "../creditRechargeModalStore";
import { generateRechargeUrl } from "../utils/deepLink";
import { request, MODE } from "@/src/shared/client/native/client";
import { UNBLOCKING_HANDLER_TYPE } from "@/src/shared/client/native/unblockingHandlerType";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useRechargeTranslation } from "../hooks/useRechargeTranslation";

// TODO: 실제 카카오톡 오픈채팅 스킴으로 변경
const KAKAO_TALK_SCHEME = "kakaolink://";
const KAKAO_FALLBACK_URL = "https://open.kakao.com/o/xxx";

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

    // 3. 카카오톡 실행
    request(MODE.UNBLOCKING, UNBLOCKING_HANDLER_TYPE.OPEN_EXTERNAL_URL, {
      url: KAKAO_TALK_SCHEME,
      fallbackUrl: KAKAO_FALLBACK_URL,
      returnUrl,
    });

    // 4. 바로 SuccessStep으로 이동 (모달은 닫지 않음)
    setStep('success');
  }, [setStep]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-5">
      {/* Back Button */}
      <div className="w-full">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label={t('kakao.backButton')}
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">{t('kakao.backButton')}</span>
        </button>
      </div>

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
        className="w-full max-w-[260px] py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
        style={{ backgroundColor: '#FEE500' }}
        aria-label={t('kakao.shareButton')}
      >
        <RiKakaoTalkFill size={20} className="text-black/85" />
        <span className="text-base font-semibold text-black/85">{t('kakao.shareButton')}</span>
      </button>
    </div>
  );
}
