import { useState, useCallback } from "react";
import { Copy } from "lucide-react";
import { useCreditRechargeModalStore } from "../creditRechargeModalStore";
import { copyToClipboard } from "../utils/clipboard";
import { toast } from "sonner";
import { useRechargeTranslation } from "../hooks/useRechargeTranslation";
import Image from "next/image";

export function ClipboardStep() {
  const { setStep } = useCreditRechargeModalStore();
  const [isCopying, setIsCopying] = useState(false);
  const { t } = useRechargeTranslation();

  // 표시용 링크 (홈페이지)
  const displayLink = "https://www.cheftories.com";

  // 실제 복사될 콘텐츠 (서비스 소개 + 홈페이지 링크)
  const getShareContent = () => {
    return `🍳 셰프토리에서 레시피 공유하고 맛있는 요리를 만들어보세요!\n\n나만의 레시피를 정리하고, 친구들과 공유하며 요리 실력을 UP!\n\n지금 바로 시작해보세요 👇\nhttps://www.cheftories.com`;
  };

  const handleCopy = useCallback(async () => {
    setIsCopying(true);
    const shareContent = getShareContent();
    const result = await copyToClipboard(shareContent);

    if (result.success) {
      toast.success(t('clipboard.copySuccess'), { duration: 1500 });
      setTimeout(() => setStep('kakao'), 500);
    } else {
      toast.error(t('clipboard.copyError'), { duration: 2000 });
    }

    setIsCopying(false);
  }, [setStep, t]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[280px] h-full">
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        {/* Icon */}
        <div className="w-16 h-16 flex items-center justify-center">
          <Image
            src="/images/tory/tory_welcome.png"
            alt="토리 캐릭터"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-lg lg:text-xl font-bold">{t('clipboard.title')}</h2>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {t('clipboard.description')}
          </p>
        </div>

        {/* Invite Link */}
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <input
              type="text"
              value={displayLink}
              readOnly
              className="w-full bg-transparent text-sm text-gray-700 outline-none"
              aria-label={t('clipboard.inviteLinkLabel')}
            />
            <button
              onClick={handleCopy}
              disabled={isCopying}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-colors active:scale-95 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white active:bg-orange-700"
              aria-label={t('clipboard.copyButton')}
            >
              <Copy size={16} />
              <span>{isCopying ? t('clipboard.copying') : t('clipboard.copyButton')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
