import { IoChevronForwardOutline } from "react-icons/io5";
import Link from "next/link";
import { useHomeTranslation } from "../hooks/useHomeTranslation";
import { Skeleton } from "@/components/ui/skeleton";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import {
  AlreadyEnrolledChip,
} from "../../../shared/ui/chip/recipeCreatingStatusChip";

/**
 * 공통 컴포넌트: 모바일/태블릿 모두 사용
 */

/**
 * "인기 레시피" 타이틀 (텍스트 + 화살표)
 * 클릭 시 /recommend?recipeType=POPULAR&videoType=NORMAL 로 이동
 */
export const PopularRecipesTitleReady = () => {
  const { t } = useHomeTranslation();
  return (
    <Link href="/recommend?recipeType=POPULAR&videoType=NORMAL">
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
  recipe: {
    id:string;
    isViewed:boolean;
    videoThumbnailUrl:string;
    recipeTitle:string;
    isViewd:boolean;
  };
  isTablet?: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      <div
        className={`flex relative flex-col ${isTablet ? "w-[260px] lg:w-full h-full group" : "w-[320px]"}`}
      >
        <div className={`overflow-hidden relative ${isTablet ? "rounded-lg h-[146px] lg:h-auto lg:aspect-video shadow-md md:hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1" : "rounded-md h-[180px]"}`}>
          <div className="absolute top-3 left-3 bg-black/10 z-10">
            <AlreadyEnrolledChip
              isEnrolled={
                recipe.isViewed
              }
            />
          </div>
          <img
            src={recipe.videoThumbnailUrl}
            className="block w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Desktop Hover Overlay */}
          {isTablet && (
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 lg:block hidden" />
          )}
        </div>
        <div className={`font-semibold w-full overflow-hidden line-clamp-2 mt-3 text-gray-800 group-hover:text-black transition-colors ${isTablet ? "text-sm lg:text-lg lg:leading-snug" : "text-lg"}`}>
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
    <div className="flex flex-col h-full">
      <div className="flex flex-col w-full">
        <Skeleton
          className={`${isTablet ? "w-[260px] lg:w-full h-[146px] lg:h-auto lg:aspect-video rounded-lg" : "w-[320px] h-[180px] rounded-md"}`}
        />

        <div className="w-[80%] mt-3">
          <TextSkeleton fontSize={isTablet ? "text-sm lg:text-lg" : "text-lg"} />
        </div>
        <div className="w-[40%] mt-1">
          <TextSkeleton fontSize="text-sm" />
        </div>
      </div>
    </div>
  );
}
