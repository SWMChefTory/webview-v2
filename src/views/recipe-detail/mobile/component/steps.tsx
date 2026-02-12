import { useEnrollBookmark } from "@/src/entities/user-recipe/model/useBookmark";
import Image from "next/image";
import { RecipeStep, StepDetail } from "../../common/hook/useRecipeDetailController";
import { useRecipeDetailTranslation } from "../../common/hook/useRecipeDetailTranslation";

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
  const { t } = useRecipeDetailTranslation();
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

  const StepDetails = ({
    stepDetails,
    onDetailClick,
  }: {
    stepDetails: StepDetail[];
    onDetailClick?: (sec: number) => void;
  }) => {
    return (
      <div className="rounded-md flex flex-col gap-2">
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
        className="relative px-4 min-h-[calc(100dvh-56.25vw)] overflow-hidden"
      >
        <div className="absolute z-[10] flex items-center justify-center inset-0 bg-gradient-to-t from-orange-300 to-gray-300/5">
          <div className="flex flex-col items-center justify-end h-full pb-16 gap-2">
            <div className="w-[110px] h-[100px]">
              <Image
                src="/images/tory/polite-tory.png"
                alt=""
                aria-hidden="true"
                width={110}
                height={100}
                className="object-cover object-center"
              />
            </div>
            <div className="h-3" />
            <div className="text-lg font-bold text-center">
              <span className="block">{t("lock.berryPrompt1")}</span>
              <span className="block">{t("lock.berryPrompt2")}</span>
            </div>
            <div className="flex flex-row items-center justify-center gap-1 ">
              <div className="pb-1">
                <div className="w-[20px] h-[24px]">
                  <Image
                    src="/images/berry/berry.png"
                    alt=""
                    aria-hidden="true"
                    width={20}
                    height={24}
                  />
                </div>
              </div>
              <div className="text-gray-600">{t("lock.currentBerry", { count: balance })}</div>
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
              {isEnrollingBookmark ? t("lock.loading") : t("lock.viewRecipe")}
            </button>
          </div>
        </div>
        <h2 className="text-lg font-bold">{t("tabs.recipe")}</h2>
        <div className="h-2" />
        <div className="flex flex-col gap-6">
          {steps.slice(0, 2).map((step, index) => (
            <div key={index} className="relative pl-8">
              {index !== 1 && (
                <div className="absolute left-[11px] top-6 bottom-0 w-px bg-orange-200" />
              )}
              <div className="absolute left-0 top-0 text-sm font-bold text-white bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center">
                {numberToUpperAlpha(index + 1)}
              </div>
              <p className="text-base font-bold pt-0.5">{step.subtitle}</p>
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
    <div id="recipe-steps-section" className="px-4">
      <h2 className="gap-1 text text-lg font-bold">{t("tabs.recipe")}</h2>
      <div className="h-2" />
      <div className="flex flex-col">
        {steps.map((step, index) => (
          <div key={index} className="relative pl-8 pb-4">
            {index !== steps.length - 1 && (
              <div className="absolute left-[11px] top-6 bottom-0 w-px bg-orange-200" />
            )}
            <div className="absolute left-0 top-0 text-sm font-bold text-white bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center">
              {numberToUpperAlpha(index + 1)}
            </div>
            <p className="text-base font-bold pt-0.5">{step.subtitle}</p>
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
