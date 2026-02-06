import { useCreditRechargeModalStore } from "../creditRechargeModalStore";
import { useFetchBalance } from "@/src/entities/balance/model/useFetchBalance";
import { useRechargeTranslation } from "../hooks/useRechargeTranslation";
import { useEffect, useState } from "react";
import Image from "next/image";

export function SuccessStep() {
  const { close } = useCreditRechargeModalStore();
  const { data } = useFetchBalance();
  const { t } = useRechargeTranslation();

  // 충전 결과 상태
  const [rechargeResult, setRechargeResult] = useState<{
    amount: number;
    remainingCount: number;
  } | null>(null);

  // sessionStorage에서 결과 읽기 및 주기적 체크
  useEffect(() => {
    const checkResult = () => {
      const result = sessionStorage.getItem('lastRechargeResult');
      if (result) {
        try {
          setRechargeResult(JSON.parse(result));
          sessionStorage.removeItem('lastRechargeResult');
        } catch (e) {
          console.error('Failed to parse recharge result:', e);
        }
      }
    };

    // 초기 체크
    checkResult();

    // 주기적 체크 (복귀 후 업데이트를 위해)
    const interval = setInterval(checkResult, 500);

    return () => clearInterval(interval);
  }, []);

  // 로딩 상태 여부
  const isLoading = !rechargeResult;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      {/* Icon */}
      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isLoading ? 'bg-orange-100' : 'bg-green-100'}`}>
        {isLoading ? (
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <div className="text-4xl" role="img" aria-label="체크마크 이모지">

          </div>
        )}
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-xl lg:text-2xl font-bold">
          {isLoading ? '공유 처리 중...' : t('success.title')}
        </h2>
        <p className="text-gray-600">
          {isLoading ? '카카오톡에서 공유를 완료해주세요' : t('success.description')}
        </p>
      </div>

      {/* Credit Display */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex items-center justify-center gap-4 p-6 bg-orange-50 rounded-xl">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="text-2xl font-bold text-orange-500">충전 처리 중...</p>
              <p className="text-sm text-gray-600">카카오톡에서 공유를 완료하면 자동으로 충전됩니다</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-4 p-6 bg-red-50 rounded-xl">
              <Image
                src="/images/berry/berry.png"
                alt="베리"
                width={48}
                height={48}
                className="object-contain"
              />
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
                <p className="text-gray-600">
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
              <p className="text-gray-600">
                {t('success.currentBalance', { balance: data?.balance ?? 0 })}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Confirm Button */}
      {!isLoading && (
        <button
          onClick={close}
          className="w-full max-w-[320px] py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors active:scale-95"
          aria-label={t('success.confirmButton')}
        >
          {t('success.confirmButton')}
        </button>
      )}
    </div>
  );
}
