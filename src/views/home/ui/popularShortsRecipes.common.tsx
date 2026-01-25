import Fire from "./assets/fire.png";
import { useHomeTranslation } from "../hooks/useHomeTranslation";
import { Skeleton } from "@/components/ui/skeleton";
// import { PopularSummaryRecipeDto } from "@/src/entities/popular-recipe/api/api";
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
    <div className="pl-4 flex items-center gap-2">
      <div className="text-xl font-semibold">{t("shortsPopularRecipes")}</div>
      <img src={Fire.src} className="size-6" />
    </div>
  );
};

/**
 * Shorts 레시피 카드 컴포넌트
 * 세로형 (180x320)
 * 모바일: 180px 고정 width
 * 태블릿: w-full (Grid에 맞춤)
 */
export function ShortsRecipeCardReady({
  recipe,
  isTablet = false,
}: {
  recipe: {
    id:string;
    isViewed:boolean;
    videoThumbnailUrl:string;
    recipeTitle:string;
  };
  isTablet?: boolean;
}) {
  const { recipeStatus } = useFetchRecipeProgress({
    recipeId: recipe.id,
  });
  return (
    <div
      className={`relative ${isTablet ? "w-full aspect-[9/16]" : "w-[180px] h-[320px]"} overflow-hidden rounded-md`}
    >
      <div className="absolute top-[12] left-[8] z-10">
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
      <div className="absolute text-left bottom-[24] w-[90%] left-[10] font-bold text-white line-clamp-2">
        {recipe.recipeTitle}
      </div>
    </div>
  );
}

/**
 * Shorts 레시피 카드 스켈레톤
 * 모바일: 180px 고정 width
 * 태블릿: w-full (Grid에 맞춤)
 */
export function ShortsRecipeCardSkeleton({
  isTablet = false,
}: {
  isTablet?: boolean;
}) {
  return (
    <Skeleton
      className={`flex shrink-0 ${isTablet ? "w-full aspect-[9/16]" : "w-[180px] h-[320px]"} rounded-md`}
    />
  );
}
