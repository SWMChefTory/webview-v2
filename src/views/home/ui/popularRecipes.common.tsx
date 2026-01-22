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
      <div className="pl-4 md:pl-0 flex items-center">
        <div className="text-xl md:text-2xl lg:text-2xl xl:text-3xl font-semibold">{t("popularRecipes")}</div>
        <IoChevronForwardOutline className="size-6 md:size-7 lg:size-7 xl:size-8" color="black" />
      </div>
    </Link>
  );
};

/**
 * 레시피 카드 컴포넌트
 * 모바일: 320px 고정 width
 * 태블릿: 260px 고정 width (가로 스크롤에 최적화)
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
        className={`flex relative flex-col ${isTablet ? "w-[260px] lg:w-[280px] xl:w-[300px] md:hover:scale-[1.02] md:transition-transform md:duration-200" : "w-[320px]"}`}
      >
        <div className={`overflow-hidden ${isTablet ? "rounded-lg h-[146px] lg:h-[158px] xl:h-[169px] shadow-md md:hover:shadow-lg md:transition-shadow md:duration-200" : "rounded-md h-[180px]"}`}>
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
        <div className={`font-semibold w-full overflow-hidden line-clamp-2 mt-2 ${isTablet ? "text-sm lg:text-base" : "text-lg"}`}>
          {recipe.recipeTitle}
        </div>
      </div>
    </div>
  );
}

/**
 * 레시피 카드 스켈레톤
 * 모바일: 320px 고정 width
 * 태블릿: 260px 고정 width (가로 스크롤에 최적화)
 */
export function RecipeCardSkeleton({ isTablet = false }: { isTablet?: boolean }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <Skeleton
          className={`${isTablet ? "w-[260px] lg:w-[280px] xl:w-[300px] h-[146px] lg:h-[158px] xl:h-[169px] rounded-lg" : "w-[320px] h-[180px] rounded-md"}`}
        />

        <div className="w-[50%] mt-2">
          <TextSkeleton fontSize={isTablet ? "text-sm lg:text-base" : "text-lg"} />
        </div>
        <div className="w-[20%]">
          <TextSkeleton fontSize="text-sm" />
        </div>
      </div>
    </div>
  );
}
