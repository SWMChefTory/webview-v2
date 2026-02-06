import { useState, useCallback } from "react";
import { Copy } from "lucide-react";
import { useCreditRechargeModalStore } from "../creditRechargeModalStore";
import { copyToClipboard } from "../utils/clipboard";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { toast } from "sonner";
import { fetchUserModel } from "@/src/views/settings/entities/user/model";
import { useRechargeTranslation } from "../hooks/useRechargeTranslation";
import { useFetchBalance } from "@/src/entities/balance/model/useFetchBalance";

export function ClipboardStep() {
  const { setStep } = useCreditRechargeModalStore();
  const [isCopying, setIsCopying] = useState(false);
  const { t } = useRechargeTranslation();
  const { data } = useFetchBalance();

  // Get actual user ID from user model
  const { user } = fetchUserModel();
  const userId = user.tag; // Use user's 4-digit tag as ID
  const inviteLink = `https://chef.co.kr/invite/${userId}`;

  // 남은 충전 횟수
  const remainingCount = data?.remainingRechargeCount ?? 10;
  const isDisabled = remainingCount <= 0;

  const handleCopy = useCallback(async () => {
    // 횟수 소진 시 체크
    if (isDisabled) {
      toast.error(t('clipboard.noRemainingCount'));
      return;
    }

    setIsCopying(true);
    const result = await copyToClipboard(inviteLink);

    track(AMPLITUDE_EVENT.RECHARGE_CLIPBOARD_COPY, {
      success: result.success
    });

    if (result.success) {
      toast.success(t('clipboard.copySuccess'));
      setTimeout(() => setStep('kakao'), 500);
    } else {
      toast.error(t('clipboard.copyError'));
    }

    setIsCopying(false);
  }, [inviteLink, setStep, t, isDisabled]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      {/* Icon */}
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
        <div className="text-4xl" role="img" aria-label="편지 이모지">

        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-xl lg:text-2xl font-bold">{t('clipboard.title')}</h2>
        <p className="text-gray-600 whitespace-pre-line">
          {t('clipboard.description')}
        </p>
      </div>

      {/* Invite Link */}
      <div className="w-full">
        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <input
            type="text"
            value={inviteLink}
            readOnly
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
            aria-label={t('clipboard.inviteLinkLabel')}
          />
          <button
            onClick={handleCopy}
            disabled={isCopying || isDisabled}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              isDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white'
            }`}
            aria-label={t('clipboard.copyButton')}
            aria-disabled={isDisabled}
          >
            <Copy size={16} />
            <span>{isCopying ? t('clipboard.copying') : t('clipboard.copyButton')}</span>
          </button>
        </div>

        {/* 남은 횟수 표시 */}
        <div className="mt-3 text-center text-sm text-gray-500">
          {t('clipboard.remainingCount', { count: remainingCount })}
        </div>
      </div>
    </div>
  );
}
