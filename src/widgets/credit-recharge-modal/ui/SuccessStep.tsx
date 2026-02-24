import { useCreditRechargeModalStore } from "../creditRechargeModalStore";
import { useFetchBalance, CREDIT_PER_SHARE } from "@/src/entities/balance";
import { useRechargeTranslation } from "../hooks/useRechargeTranslation";
import Image from "next/image";

export function SuccessStep() {
  const { close, rechargeResult } = useCreditRechargeModalStore();
  const { data } = useFetchBalance();
  const { t } = useRechargeTranslation();

  // 로딩 상태: 결과가 없으면 로딩 중
  const isLoading = !rechargeResult;
  const isLimitExceeded = rechargeResult?.amount === 0;

  return (
    <div className="flex flex-col min-h-[280px] h-full">
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        {/* Icon + Berry + Amount */}
        {isLoading ? (
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-orange-100">
            <svg className="animate-spin size-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : isLimitExceeded ? (
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📢</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/images/berry/berry.png"
              alt="베리"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-2xl font-bold text-red-500">+{rechargeResult?.amount ?? CREDIT_PER_SHARE}</span>
          </div>
        )}

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-lg lg:text-xl font-bold">
            {isLoading ? t('success.loadingTitle') : isLimitExceeded ? t('success.limitExceededTitle') : t('success.title')}
          </h2>
          {isLoading ? (
            <p className="text-sm text-gray-600">{t('success.loadingDescription')}</p>
          ) : isLimitExceeded ? (
            <div className="text-sm text-gray-600 space-y-1">
              <p>{t('success.limitExceededLine1')}</p>
              <p>{t('success.limitExceededLine2')}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">{t('success.description')}</p>
          )}
        </div>

        {/* Credit Display */}
        <div className="w-full max-w-md">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-3 bg-orange-50 rounded-xl">
              <svg className="animate-spin size-6 text-orange-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-orange-500">{t('success.loadingTitle')}</p>
                <p className="text-xs text-gray-600 truncate">{t('success.loadingDescription')}</p>
              </div>
            </div>
          ) : isLimitExceeded ? (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                {t('success.currentBalanceLabel')}<span className="font-semibold text-gray-900">{data?.balance ?? 0}</span>
              </p>
            </div>
          ) : (
            <div className="text-center space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-orange-500">{rechargeResult?.amount ?? CREDIT_PER_SHARE}</span>
                <span>{t('success.creditCharged')}</span>
              </p>
              <p className="text-xs text-gray-500">
                {t('success.currentBalanceLabel')}<span className="font-semibold text-gray-900">{data?.balance ?? 0}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Button - Pinned to bottom */}
      {!isLoading && (
        <div className="w-full pt-4 mt-auto">
          <button
            onClick={close}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors active:scale-95"
            aria-label={t('success.confirmButton')}
          >
            {t('success.confirmButton')}
          </button>
        </div>
      )}
    </div>
  );
}
