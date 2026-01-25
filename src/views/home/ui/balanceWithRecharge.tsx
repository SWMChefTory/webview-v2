import Image from "next/image";
import { useFetchBalance } from "@/src/entities/balance/model/useFetchBalance";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { HiPlus } from "react-icons/hi2";

const BalanceWithRechargeSkeleton = () => {
  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-full px-2.5 py-1 md:px-3 md:py-1.5 lg:px-3.5 lg:py-2 gap-1.5 shadow-sm">
      <div className="flex items-center gap-1">
        <Image
          src="/images/berry/berry.png"
          alt="berry"
          width={18}
          height={18}
          className="object-contain w-[18px] h-[18px] md:w-5 md:h-5 lg:w-6 lg:h-6"
        />
        <span className="text-sm md:text-base lg:text-lg text-red-500 font-bold">0</span>
      </div>
      <div className="w-[1px] h-3 md:h-4 lg:h-5 bg-gray-200" />
      <button
        className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-md active:shadow-sm active:from-orange-500 active:to-orange-700 active:translate-y-0.5 transition-all"
        aria-label="Recharge berries"
      >
        <HiPlus className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white drop-shadow-sm font-bold" strokeWidth={2} />
      </button>
    </div>
  );
};

const BalanceWithRechargeReady = ({ balance }: { balance: number }) => {
  const handleRechargeClick = () => {
    track(AMPLITUDE_EVENT.RECHARGE_CLICK, {
      source: "home_header",
    });
    // TODO: 충전 기능이 백엔드에 구현되면 연결
  };

  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-full px-2.5 py-1 md:px-3 md:py-1.5 lg:px-3.5 lg:py-2 gap-1.5 shadow-sm">
      <div className="flex items-center gap-1">
        <Image
          src="/images/berry/berry.png"
          alt="berry"
          width={18}
          height={18}
          className="object-contain w-[18px] h-[18px] md:w-5 md:h-5 lg:w-6 lg:h-6"
        />
        <span className="text-sm md:text-base lg:text-lg text-red-500 font-bold">{balance}</span>
      </div>
      <div className="w-[1px] h-3 md:h-4 lg:h-5 bg-gray-200" />
      <button
        onClick={handleRechargeClick}
        className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-md active:shadow-sm active:from-orange-500 active:to-orange-700 active:translate-y-0.5 transition-all"
        aria-label="Recharge berries"
      >
        <HiPlus className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white drop-shadow-sm font-bold" strokeWidth={2} />
      </button>
    </div>
  );
};

function BalanceWithRechargeContent() {
  const { data: balance } = useFetchBalance();
  return <BalanceWithRechargeReady balance={balance.balance} />;
}

export function BalanceWithRecharge() {
  return (
    <SSRSuspense fallback={<BalanceWithRechargeSkeleton />}>
      <BalanceWithRechargeContent />
    </SSRSuspense>
  );
}
