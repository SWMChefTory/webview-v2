import { IoChevronForwardOutline } from "react-icons/io5";
import { useHomeTranslation } from "../hooks/useHomeTranslation";
import { Skeleton } from "@/components/ui/skeleton";
// import { PopularSummaryRecipeDto } from "@/src/entities/popular-recipe/api/api";
import { useFetchRecipeProgress } from "@/src/entities/user-recipe/model/useUserRecipe";
import { RecipeStatus } from "@/src/entities/user-recipe";
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
    <div className="pl-4 md:pl-0 flex items-center  lg:gap-3">
      <div className="text-xl md:text-2xl lg:text-2xl xl:text-3xl font-semibold">
        {t("shortsPopularRecipes")}
      </div>
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
  recipe: {
    id: string;
    isViewed: boolean;
    videoThumbnailUrl: string;
    recipeTitle: string;
  };
  isTablet?: boolean;
}) {
  const { recipeStatus } = useFetchRecipeProgress({
    recipeId: recipe.id,
  });
  return (
    <div
      className={`relative ${
        isTablet
          ? "w-[130px] lg:w-full h-[231px] lg:h-auto lg:aspect-[9/16] rounded-lg shadow-md md:hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
          : "w-[180px] h-[320px] rounded-md"
      } overflow-hidden`}
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
        className="block w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 lg:opacity-80 transition-opacity duration-300" />

      <div
        className={`absolute text-left w-[90%] left-2 font-bold text-white line-clamp-2 z-10 ${
          isTablet
            ? "bottom-4 text-xs lg:text-lg lg:leading-tight lg:bottom-6"
            : "bottom-[24] left-[10] text-base"
        }`}
      >
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
      className={`flex shrink-0 ${
        isTablet
          ? "w-[130px] lg:w-full h-[231px] lg:h-auto lg:aspect-[9/16] rounded-lg"
          : "w-[180px] h-[320px] rounded-md"
      }`}
    />
  );
}
import Link from "next/link";
