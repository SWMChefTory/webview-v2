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

  // 개발 모드 자동 완료 시뮬레이션
  const isDev = process.env.NODE_ENV === 'development';

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

    // 개발 모드: 2초 후 자동 완료 시뮬레이션
    if (isDev && !rechargeResult) {
      const timer = setTimeout(() => {
        const mockResult = {
          amount: 10,
          remainingCount: 9,
        };
        setRechargeResult(mockResult);
        console.log('[Dev] 충전 완료 시뮬레이션:', mockResult);
      }, 2000);
      return () => clearTimeout(timer);
    }

    // 주기적 체크 (복귀 후 업데이트를 위해)
    const interval = setInterval(checkResult, 500);

    return () => clearInterval(interval);
  }, [isDev]);

  // 로딩 상태 여부
  const isLoading = !rechargeResult;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-5">
      {/* Icon */}
      {isLoading ? (
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-orange-100">
          <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
          <Image
            src="/images/tory/tory_welcome.png"
            alt="토리 캐릭터"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
      )}

      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-lg lg:text-xl font-bold">
          {isLoading ? '공유 처리 중...' : t('success.title')}
        </h2>
        <p className="text-sm text-gray-600">
          {isLoading ? '카카오톡 공유 완료 시 자동 충전됩니다' : t('success.description')}
        </p>
      </div>

      {/* Credit Display */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-3 bg-orange-50 rounded-xl">
            <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold text-orange-500">충전 처리 중...</p>
              <p className="text-xs text-gray-600 truncate">카카오톡 공유 완료 시 자동 충전됩니다</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 p-3 bg-red-50 rounded-xl">
              <Image
                src="/images/berry/berry.png"
                alt="베리"
                width={24}
                height={24}
                className="object-contain"
              />
              <div>
                {/* 동적 충전량 표시 */}
                <p className="text-xl lg:text-2xl font-bold text-red-500">
                  +{rechargeResult?.amount ?? 10}
                </p>
                <p className="text-xs text-gray-600">{t('success.creditAdded')}</p>
              </div>
            </div>

            <div className="mt-2 text-center">
              <p className="text-sm text-gray-600">
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
          className="w-full max-w-[260px] py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors active:scale-95"
          aria-label={t('success.confirmButton')}
        >
          {t('success.confirmButton')}
        </button>
      )}
    </div>
  );
}
