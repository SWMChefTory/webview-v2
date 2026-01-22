import Fire from "./assets/fire.png";
import { useHomeTranslation } from "../hooks/useHomeTranslation";
import { Skeleton } from "@/components/ui/skeleton";
import { PopularSummaryRecipeDto } from "@/src/entities/popular-recipe/api/api";
import { useFetchRecipeProgress } from "@/src/entities/user-recipe/model/useUserRecipe";
import { RecipeStatus } from "@/src/entities/user-recipe/type/type";
import {
  AlreadyEnrolledChip,
  CreatingStatusChip,
} from "../../../shared/ui/chip/recipeCreatingStatusChip";

/**
 * 공통 컴포넌트: 모바일/태블릿 모두 사용
 */

/**
 * "쇼츠 인기 레시피" 타이틀 (텍스트 + Fire 아이콘)
 */
export const PopularShortsRecipesTitleReady = () => {
  const { t } = useHomeTranslation();
  return (
    <div className="pl-4 md:pl-0 flex items-center gap-2 lg:gap-3">
      <div className="text-xl md:text-2xl lg:text-2xl xl:text-3xl font-semibold">{t("shortsPopularRecipes")}</div>
      <img src={Fire.src} className="size-6 md:size-7 lg:size-7 xl:size-8" alt="fire" />
    </div>
  );
};

/**
 * Shorts 레시피 카드 컴포넌트
 * 세로형 (9:16 비율)
 * 모바일: 180x320 고정
 * 태블릿: 130x231 고정 (가로 스크롤에 최적화)
 */
export function ShortsRecipeCardReady({
  recipe,
  isTablet = false,
}: {
  recipe: PopularSummaryRecipeDto;
  isTablet?: boolean;
}) {
  const { recipeStatus } = useFetchRecipeProgress({
    recipeId: recipe.recipeId,
  });
  return (
    <div
      className={`relative ${isTablet ? "w-[130px] lg:w-[140px] xl:w-[150px] h-[231px] lg:h-[249px] xl:h-[267px] rounded-lg shadow-md md:hover:shadow-lg md:hover:scale-[1.02] md:transition-all md:duration-200" : "w-[180px] h-[320px] rounded-md"} overflow-hidden`}
    >
      <div className="absolute top-2 left-2 z-10">
        <AlreadyEnrolledChip
          isEnrolled={recipe.isViewed && recipeStatus === RecipeStatus.SUCCESS}
        />
        <CreatingStatusChip
          isInCreating={recipeStatus === RecipeStatus.IN_PROGRESS}
        />
      </div>
      <img
        src={recipe.videoThumbnailUrl}
        className="block w-full h-full object-cover"
      />
      <div className={`absolute text-left w-[90%] left-2 font-bold text-white line-clamp-2 ${isTablet ? "bottom-4 text-xs lg:text-sm" : "bottom-[24] left-[10] text-base"}`}>
        {recipe.recipeTitle}
      </div>
    </div>
  );
}

/**
 * Shorts 레시피 카드 스켈레톤
 * 모바일: 180x320 고정
 * 태블릿: 130x231 고정 (가로 스크롤에 최적화)
 */
export function ShortsRecipeCardSkeleton({
  isTablet = false,
}: {
  isTablet?: boolean;
}) {
  return (
    <Skeleton
      className={`flex shrink-0 ${isTablet ? "w-[130px] lg:w-[140px] xl:w-[150px] h-[231px] lg:h-[249px] xl:h-[267px] rounded-lg" : "w-[180px] h-[320px] rounded-md"}`}
    />
  );
}
