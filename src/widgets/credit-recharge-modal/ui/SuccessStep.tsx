import { useCreditRechargeModalStore } from "../creditRechargeModalStore";
import { useFetchBalance } from "@/src/entities/balance/model/useFetchBalance";
import { useRechargeTranslation } from "../hooks/useRechargeTranslation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";

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
    const maxPollingTime = 5 * 60 * 1000; // 5 minutes
    const startTime = Date.now();

    const interval = setInterval(() => {
      if (Date.now() - startTime > maxPollingTime) {
        clearInterval(interval);
        console.log('[Dev] Polling timeout - 5 minutes elapsed');
        return;
      }
      checkResult();
    }, 1500);

    return () => clearInterval(interval);
  }, [isDev]);

  // 로딩 상태 여부
  const isLoading = !rechargeResult;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-5">
      {/* Icon + Berry + Amount */}
      {isLoading ? (
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-orange-100">
          <Spinner className="size-6 text-orange-500" />
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
          <span className="text-2xl font-bold text-red-500">+{rechargeResult?.amount ?? 10}</span>
        </div>
      )}

      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-lg lg:text-xl font-bold">
          {isLoading ? t('success.loadingTitle') : t('success.title')}
        </h2>
        <p className="text-sm text-gray-600">
          {isLoading ? t('success.loadingDescription') : t('success.description')}
        </p>
      </div>

      {/* Credit Display */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-3 bg-orange-50 rounded-xl">
            <Spinner className="size-6 text-orange-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold text-orange-500">{t('success.loadingTitle')}</p>
              <p className="text-xs text-gray-600 truncate">{t('success.loadingDescription')}</p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-orange-500">{rechargeResult?.amount ?? 10}</span>
              <span>베리가 충전되었어요</span>
            </p>
            <p className="text-xs text-gray-500">
              현재 베리: <span className="font-semibold text-gray-900">{data?.balance ?? 0}</span>
            </p>
          </div>
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
