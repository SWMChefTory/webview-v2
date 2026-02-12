import { useEnrollBookmark } from "@/src/entities/user-recipe/model/useBookmark";
import Image from "next/image";
import { Lock, Play } from "lucide-react";
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
            className="flex items-start gap-1.5 text-sm font-medium shadow-sm bg-white p-2 rounded-md text-left
                transition-all duration-150
                hover:bg-orange-50 hover:shadow
                active:scale-[0.97] active:shadow-none active:bg-orange-100
                focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2
                cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-orange-400 fill-orange-400" />
            <span>{detail.text}</span>
          </button>
        ))}
      </div>
    );
  };

  if (!isEnrolled) {
    return (
      <div id="recipe-steps-section" className="px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{t("tabs.recipe")}</h2>
          <button
            type="button"
            onClick={handleEnrollBookmark}
            disabled={isEnrollingBookmark}
            className="flex items-center gap-1.5 rounded-full bg-white border border-orange-200 pl-2.5 pr-3 py-1.5
              shadow-sm
              transition-all duration-150
              hover:bg-orange-50 hover:border-orange-300
              active:scale-[0.95]
              focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              cursor-pointer"
          >
            <Image
              src="/images/berry/berry.png"
              alt=""
              aria-hidden="true"
              width={13}
              height={16}
            />
            <span className="text-xs font-bold text-orange-600">1개로 열기</span>
          </button>
        </div>
        <div className="h-2" />
        <div className="flex flex-col">
          {steps.map((step, index) => {
            const isFirst = index === 0;
            return (
              <div key={index} className="relative pl-8 pb-4">
                {index !== steps.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-orange-200" />
                )}
                <div className="absolute left-0 top-0 text-sm font-bold text-white bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center">
                  {numberToUpperAlpha(index + 1)}
                </div>
                {isFirst ? (
                  <>
                    <h3 className="text-base font-bold pt-0.5">{step.subtitle}</h3>
                    <div className="h-2" />
                    <StepDetails stepDetails={step.details} onDetailClick={onTimeClick} />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <h3 className="text-base font-bold">{step.subtitle}</h3>
                      <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    </div>
                    <div className="h-2" />
                    <div className="blur-[6px] select-none pointer-events-none">
                      <StepDetails stepDetails={step.details} />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <div className="rounded-2xl border border-orange-100 overflow-hidden shadow-sm">
          <div className="bg-gradient-to-b from-amber-50 via-orange-50 to-white pt-7 pb-4 flex flex-col items-center">
            <Image
              src="/images/tory/polite-tory.png"
              alt=""
              aria-hidden="true"
              width={100}
              height={91}
              className="object-contain drop-shadow-md"
            />
          </div>
          <div className="px-5 pb-8 flex flex-col items-center gap-3">
            <div className="text-center leading-snug">
              <p className="text-[15px] font-bold text-gray-900">
                {t("lock.berryPrompt1")}
              </p>
              <p className="text-[15px] font-bold text-gray-900">
                {t("lock.berryPrompt2")}
              </p>
            </div>
            <span className="text-xs text-gray-500">
              {t("lock.currentBerry", { count: balance })}
            </span>
          </div>
        </div>
        <div className="h-[calc(5rem+env(safe-area-inset-bottom))]" />
      </div>
    );
  }

  return (
    <div id="recipe-steps-section" className="px-4">
      <h2 className="text-lg font-bold">{t("tabs.recipe")}</h2>
      <div className="h-2" />
      <div className="flex flex-col">
        {steps.map((step, index) => (
          <div key={index} className="relative pl-8 pb-4">
            {index !== steps.length - 1 && (
              <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-orange-200" />
            )}
            <div className="absolute left-0 top-0 text-sm font-bold text-white bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center">
              {numberToUpperAlpha(index + 1)}
            </div>
            <h3 className="text-base font-bold pt-0.5">{step.subtitle}</h3>
            <div className="h-2" />
            <StepDetails
              stepDetails={step.details}
              onDetailClick={onTimeClick}
            />
          </div>
        ))}
      </div>
      <div className="h-[calc(5rem+env(safe-area-inset-bottom))]" />
    </div>
  );
};

export { Steps };
