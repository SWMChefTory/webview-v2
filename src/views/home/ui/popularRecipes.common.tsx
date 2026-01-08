import { IoChevronForwardOutline } from "react-icons/io5";
import Link from "next/link";
import { useHomeTranslation } from "../hooks/useHomeTranslation";
import { Skeleton } from "@/components/ui/skeleton";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
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
 * "인기 레시피" 타이틀 (텍스트 + 화살표)
 * 클릭 시 /popular-recipe로 이동
 */
export const PopularRecipesTitleReady = () => {
  const { t } = useHomeTranslation();
  return (
    <Link href="/popular-recipe">
      <div className="pl-4 flex items-center">
        <div className="text-xl font-semibold">{t("popularRecipes")}</div>
        <IoChevronForwardOutline className="size-6" color="black" />
      </div>
    </Link>
  );
};

/**
 * 레시피 카드 컴포넌트
 * 모바일: 320px 고정 width
 * 태블릿: w-full (Grid에 맞춤)
 */
export function RecipeCardReady({
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
    <div className="flex flex-col">
      <div
        className={`flex relative flex-col ${isTablet ? "w-full" : "w-[320px]"}`}
      >
        <div className={`overflow-hidden rounded-md ${isTablet ? "aspect-video" : "h-[180px]"}`}>
          <div className="absolute top-3 left-3 bg-black/10 z-10">
            <AlreadyEnrolledChip
              isEnrolled={
                recipeStatus === RecipeStatus.SUCCESS && recipe.isViewed
              }
            />
            <CreatingStatusChip
              isInCreating={recipeStatus === RecipeStatus.IN_PROGRESS}
            />
          </div>
          <img
            src={recipe.videoThumbnailUrl}
            className="block w-full h-full object-cover"
          />
        </div>
        <div className="text-lg font-semibold w-full overflow-hidden line-clamp-2">
          {recipe.recipeTitle}
        </div>
      </div>
    </div>
  );
}

/**
 * 레시피 카드 스켈레톤
 * 모바일: 320px 고정 width
 * 태블릿: w-full (Grid에 맞춤)
 */
export function RecipeCardSkeleton({ isTablet = false }: { isTablet?: boolean }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <Skeleton
          className={`${isTablet ? "w-full aspect-video" : "w-[320px] h-[180px]"} rounded-md`}
        />

        <div className="w-[50%]">
          <TextSkeleton fontSize="text-lg" />
        </div>
        <div className="w-[20%]">
          <TextSkeleton fontSize="text-sm" />
        </div>
      </div>
    </div>
  );
}
