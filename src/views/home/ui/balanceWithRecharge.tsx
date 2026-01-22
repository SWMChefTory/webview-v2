import Image from "next/image";
import { useFetchBalance } from "@/src/entities/balance/model/useFetchBalance";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { HiPlus } from "react-icons/hi2";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAnimate } from "motion/react";

const BalanceWithRechargeSkeleton = () => {
  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-full px-2.5 py-1 gap-1.5 shadow-sm">
      <div className="flex items-center gap-1">
        <Image
          src="/images/berry/berry.png"
          alt="berry"
          width={18}
          height={18}
          className="object-contain"
        />
        <span className="text-sm text-red-500 font-bold">0</span>
      </div>
      <div className="w-[1px] h-3 bg-gray-200" />
      <button
        className="flex items-center justify-center w-6 h-6 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-md active:shadow-sm active:from-orange-500 active:to-orange-700 active:translate-y-0.5 transition-all"
        aria-label="Recharge berries"
      >
        <HiPlus
          className="w-4 h-4 text-white drop-shadow-sm font-bold"
          strokeWidth={2}
        />
      </button>
    </div>
  );
};

const BalanceWithRechargeReady = ({ balance }: { balance: number }) => {
  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-full px-2.5 py-1 gap-1.5 shadow-sm">
      <div className="flex items-center gap-1">
        <Image
          src="/images/berry/berry.png"
          alt="berry"
          width={18}
          height={18}
          className="object-contain"
        />
        <span className="text-sm text-red-500 font-bold">{balance}</span>
      </div>
      <div className="w-[1px] h-3 bg-gray-200" />
      <RechargeButton />
    </div>
  );
};

const RechargeButton = () => {
  const [scope, animate] = useAnimate();
  const handleRechargeClick = () => {
    animate(
      scope.current,
      { opacity: [1, 1, 0] },
      { times: [0, 0.5, 1], duration: 3, ease: "easeOut" }
    );
    track(AMPLITUDE_EVENT.RECHARGE_CLICK, {
      source: "home_header",
    });
    // TODO: 충전 기능이 백엔드에 구현되면 연결
  };
  return (
    <div className="relative">
      <button
        onClick={handleRechargeClick}
        className="flex items-center justify-center w-6 h-6 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-md active:shadow-sm active:from-orange-500 active:to-orange-700 active:translate-y-0.5 transition-all"
        aria-label="Recharge berries"
      >
        <HiPlus
          className="w-4 h-4 text-white drop-shadow-sm font-bold"
          strokeWidth={2}
        />
      </button>
      <div ref={scope} style={{ opacity: 0 }} className="absolute pt-2">
        <div className="relative bg-gray-500 px-2 py-1 text-white text-xs rounded-md shadow-md whitespace-nowrap ">
          <p>구현중인</p>
          <p>기능이에요</p>
          <div
            className="
      absolute
      left-3 bottom-full
      w-0 h-0
      border-l-8 border-l-transparent
      border-r-8 border-r-transparent
      border-b-8 border-b-gray-500
    "
          />
        </div>
      </div>
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

// function CategoryCreatingInputForm({
//   name,
//   onNameChange,
//   isError,
// }: {
//   name: string;
//   onNameChange: (name: string) => void;
//   isError: boolean;
// }) {
//   const [scope, animate] = useAnimate();
//   const { t } = useCategoryCreatingTranslation();

//   const handleNameChange = (value: string) => {
//     if (isTooLong({ name: value })) {
//       animate(
//         scope.current,
//         { opacity: [1, 1, 0] },
//         { times: [0, 0.5, 1], duration: 2, ease: "easeOut" }
//       );
//       return;
//     }
//     onNameChange(value);
//   };

//   return (
//     <div className="relative">
//       <div
//         ref={scope}
//         style={{ opacity: 0 }}
//         className="absolute right-[4] bottom-full bg-gray-500 text-white text-xs px-3 py-2 rounded-md shadow-md whitespace-nowrap"
//       >
//         {t("form.errorTooLong")}
//         <div
//           className="absolute left-2/3 top-full w-0 h-0
//           border-l-8 border-l-transparent
//           border-r-8 border-r-transparent
//           border-t-8 border-t-gray-500"
//         />
//       </div>
//       <div className="h-[10]" />
//       <FormInput
//         value={name}
//         onChange={handleNameChange}
//         isError={isError}
//         errorMessage={t("form.errorEmpty")}
//         placeholder={t("form.placeholder")}
//       />
//     </div>
//   );
// }
