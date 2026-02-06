import { useEnrollBookmark } from "@/src/entities/user-recipe/model/useBookmark";
// import { RecipeStep } from "@/src/views/recipe-step/type/recipeSteps";

import Image from "next/image";
import { RecipeStep, StepDetail } from "../../common/hook/useRecipeDetailController";

const Steps = ({
  steps,
  isEnrolled,
  onTimeClick,
  balance = 0,
  recipeId,
}: {
  steps: RecipeStep[];
  isEnrolled: boolean;
  onTimeClick?: (sec: number) => void;
  balance?: number;
  recipeId: string;
}) => {
  const { enrollBookmark, isLoading: isEnrollingBookmark } =
    useEnrollBookmark();
  const handleEnrollBookmark = () => {
    if (!isEnrollingBookmark) {
      enrollBookmark(recipeId);
    }
  };

  const numberToUpperAlpha = (n: number) => {
    return String.fromCharCode(64 + n);
  };

  const StepTitle = ({
    index,
    stepTitle,
  }: {
    index: number;
    stepTitle: string;
  }) => {
    const Order = () => {
      return (
        <div className="text-sm font-bold text-white bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center">
          {numberToUpperAlpha(index + 1)}
        </div>
      );
    };

    return (
      <div className="flex items-center gap-2">
        <Order />
        <p className="text-base font-bold">{stepTitle}</p>
      </div>
    );
  };

  const StepDetails = ({
    stepDetails,
    onDetailClick,
  }: {
    stepDetails: StepDetail[];
    onDetailClick?: (sec: number) => void;
  }) => {
    return (
      <div className="px-2 rounded-md bg-gray-100 flex flex-col gap-2">
        {stepDetails.map((detail, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onDetailClick?.(detail.start)}
            className="text-sm font-bold shadow-lg bg-white p-2 rounded-md text-left
                transition-all duration-150
                hover:bg-orange-50 hover:shadow-md
                active:scale-[0.97] active:shadow-sm active:bg-orange-100
                cursor-pointer"
          >
            {detail.text}
          </button>
        ))}
      </div>
    );
  };

  if (!isEnrolled) {
    return (
      <div
        id="recipe-steps-section"
        className="relative px-4 gap-2 min-h-[calc(100dvh-56.25vw)] overflow-hidden "
      >
        <div className="absolute z-[10] flex items-center justify-center inset-0 bg-gradient-to-t from-[#FDBD78] to-[#D9D9D9]/3">
          <div className="flex flex-col items-center justify-end h-full pb-16 gap-2">
            <div className="w-[110px] h-[100px]">
              <Image
                src="/images/tory/polite-tory.png"
                alt="Recipe Detail BG"
                width={110}
                height={100}
                className="object-cover object-center"
              />
            </div>
            <div className="h-3" />
            <div className="text-lg font-bold text-center">
              <span className="block">토리에게 베리 1개를 주면</span>
              <span className="block">레시피를 볼 수 있어요.</span>
            </div>
            <div className="flex flex-row items-center justify-center gap-1 ">
              <div className="pb-1">
                <div className="w-[20px] h-[24px]">
                  <Image
                    src="/images/berry/berry.png"
                    alt="Berry"
                    width={20}
                    height={24}
                  />
                </div>
              </div>
              <div className="text text-gray-600 ">{`현재 베리 : ${balance}개`}</div>
            </div>
            <button
              type="button"
              onClick={handleEnrollBookmark}
              disabled={isEnrollingBookmark}
              className="px-5 py-1.5 bg-orange-500 rounded-xl text-white font-bold text-lg
                  transition-all duration-150
                  hover:bg-orange-600 hover:shadow-md
                  active:scale-[0.97] active:shadow-sm active:bg-orange-600
                  disabled:opacity-50 disabled:cursor-not-allowed
                  cursor-pointer"
            >
              {isEnrollingBookmark ? "로딩 중..." : "레시피 보기"}
            </button>
          </div>
        </div>
        <div className=" gap-1 text text-lg font-bold">레시피</div>
        <div className="h-2" />
        <div className="flex flex-col gap-4">
          {steps.slice(0, 2).map((step, index) => (
            <div key={index} className="p-2 rounded-md bg-gray-100">
              <StepTitle index={index} stepTitle={step.subtitle} />
              <div className="h-2" />
              <StepDetails
                stepDetails={step.details}
                onDetailClick={onTimeClick}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="recipe-steps-section" className="px-4 gap-2 ">
      <div className=" gap-1 text text-lg font-bold">레시피</div>
      <div className="h-2" />
      <div className="flex flex-col gap-4">
        {steps.map((step, index) => (
          <div key={index} className="p-2 rounded-md bg-gray-100">
            <StepTitle index={index} stepTitle={step.subtitle} />
            <div className="h-2" />
            <StepDetails
              stepDetails={step.details}
              onDetailClick={onTimeClick}
            />
          </div>
        ))}
      </div>
      <div className="h-24" />
    </div>
  );
};

export { Steps };
