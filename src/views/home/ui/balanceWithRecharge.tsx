import Image from "next/image";
import { useFetchBalance } from "@/src/entities/balance/model/useFetchBalance";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { HiPlus } from "react-icons/hi2";
import { useCreditRechargeModalStore } from "@/src/widgets/credit-recharge-modal/creditRechargeModalStore";

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
        <HiPlus
          className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white drop-shadow-sm font-bold"
          strokeWidth={2}
        />
      </button>
    </div>
  );
};

const BalanceWithRechargeReady = ({ balance }: { balance: number }) => {
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
      <RechargeButton />
    </div>
  );
};

const RechargeButton = () => {
  const { open } = useCreditRechargeModalStore();

  const handleRechargeClick = () => {
    track(AMPLITUDE_EVENT.RECHARGE_CLICK, {
      source: "home_header",
    });
    open('home_header');
  };

  return (
    <button
      onClick={handleRechargeClick}
      className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-md active:shadow-sm active:from-orange-500 active:to-orange-700 active:translate-y-0.5 transition-all"
      aria-label="Recharge berries"
    >
      <HiPlus
        className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white drop-shadow-sm font-bold"
        strokeWidth={2}
      />
    </button>
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
