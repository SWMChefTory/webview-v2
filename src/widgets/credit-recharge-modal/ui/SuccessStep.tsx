import { useCreditRechargeModalStore } from "../creditRechargeModalStore";
import { useFetchBalance } from "@/src/entities/balance/model/useFetchBalance";
import { useRechargeTranslation } from "../hooks/useRechargeTranslation";
import { useEffect, useState } from "react";

export function SuccessStep() {
  const { close } = useCreditRechargeModalStore();
  const { data } = useFetchBalance();
  const { t } = useRechargeTranslation();

  // 충전 결과 상태
  const [rechargeResult, setRechargeResult] = useState<{
    amount: number;
    remainingCount: number;
  } | null>(null);

  // sessionStorage에서 결과 읽기
  useEffect(() => {
    const result = sessionStorage.getItem('lastRechargeResult');
    if (result) {
      try {
        setRechargeResult(JSON.parse(result));
        sessionStorage.removeItem('lastRechargeResult');
      } catch (e) {
        console.error('Failed to parse recharge result:', e);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      {/* Icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
        <div className="text-4xl" role="img" aria-label="체크마크 이모지">

        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-xl lg:text-2xl font-bold">{t('success.title')}</h2>
        <p className="text-gray-600">{t('success.description')}</p>
      </div>

      {/* Credit Display */}
      <div className="w-full">
        <div className="flex items-center justify-center gap-4 p-6 bg-red-50 rounded-xl">
          <div className="text-4xl" role="img" aria-label="딸기 이모지">

          </div>
          <div>
            {/* 동적 충전량 표시 */}
            <p className="text-3xl lg:text-4xl font-bold text-red-500">
              +{rechargeResult?.amount ?? 100}
            </p>
            <p className="text-sm text-gray-600">{t('success.creditAdded')}</p>
          </div>
        </div>

        {/* 남은 충전 횟수 표시 */}
        {rechargeResult && rechargeResult.remainingCount > 0 && (
          <div className="mt-4 text-center">
            <p className="text-gray-500">
              {t('success.remainingCount', { count: rechargeResult.remainingCount })}
            </p>
          </div>
        )}

        {/* 횟수 소진 시 메시지 */}
        {rechargeResult && rechargeResult.remainingCount === 0 && (
          <div className="mt-4 text-center">
            <p className="text-orange-500 font-medium">
              {t('success.noRemainingCount')}
            </p>
          </div>
        )}

        <div className="mt-2 text-center">
          <p className="text-gray-500">
            {t('success.currentBalance', { balance: data?.balance ?? 0 })}
          </p>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={close}
        className="w-full max-w-[320px] py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors active:scale-95"
        aria-label={t('success.confirmButton')}
      >
        {t('success.confirmButton')}
      </button>
    </div>
  );
}
