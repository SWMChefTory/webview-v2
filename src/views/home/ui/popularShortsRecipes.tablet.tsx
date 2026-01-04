import { useFecthPopularRecipe } from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { RecipeCardWrapper } from "../../../widgets/recipe-create-dialog/recipeCardWrapper";
import { useState, useEffect, useRef } from "react";
import {
  PopularShortsRecipesTitleReady,
  ShortsRecipeCardReady,
  ShortsRecipeCardSkeleton,
} from "./popularShortsRecipes.common";

/**
 * PopularShortsRecipes 섹션 - 태블릿 버전 (768px ~)
 *
 * 특징:
 * - 레시피 목록: Grid 5열 (Shorts는 세로형이므로 더 많은 열)
 * - 무한 스크롤: IntersectionObserver
 * - 좌우 패딩: px-6
 * - 카드: w-full aspect-[9/16] (Grid에 맞춤)
 */
export function PopularShortsRecipesTablet() {
  return (
    <PopularShortsRecipesTemplateTablet
      title={<PopularShortsRecipesTitleReady />}
      recipeSection={
        <SSRSuspense fallback={<ShortPopularRecipesSectionSkeleton />}>
          <ShortPopularRecipesSectionReady />
        </SSRSuspense>
      }
    />
  );
}

/**
 * 태블릿 레이아웃 템플릿
 * 좌우 패딩 추가 (px-6)
 */
const PopularShortsRecipesTemplateTablet = ({
  title,
  recipeSection,
}: {
  title: React.ReactNode;
  recipeSection: React.ReactNode;
}) => {
  return (
    <div className="px-6">
      <div className="h-6" />
      {title}
      <div className="h-4" />
      {recipeSection}
    </div>
  );
};

/**
 * Shorts 레시피 목록 섹션 (태블릿)
 * Grid 5열 + IntersectionObserver 무한 스크롤
 */
const ShortPopularRecipesSectionReady = () => {
  const {
    data: recipes,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useFecthPopularRecipe(VideoType.SHORTS);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver로 무한 스크롤
  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div>
      <div className="grid grid-cols-5 gap-3">
        {recipes.map((recipe) => (
          <RecipeCardWrapper
            key={recipe.recipeId}
            recipeId={recipe.recipeId}
            recipeCreditCost={recipe.creditCost}
            recipeTitle={recipe.recipeTitle}
            recipeIsViewed={recipe.isViewed}
            recipeVideoType={recipe.videoType}
            recipeVideoUrl={recipe.videoUrl}
            entryPoint="popular_normal"
            trigger={<ShortsRecipeCardReady recipe={recipe} isTablet={true} />}
          />
        ))}
        {isFetchingNextPage && (
          <>
            <ShortsRecipeCardSkeleton isTablet={true} />
            <ShortsRecipeCardSkeleton isTablet={true} />
            <ShortsRecipeCardSkeleton isTablet={true} />
            <ShortsRecipeCardSkeleton isTablet={true} />
            <ShortsRecipeCardSkeleton isTablet={true} />
          </>
        )}
      </div>
      {/* IntersectionObserver 타겟 */}
      {hasNextPage && !isFetchingNextPage && (
        <div ref={loadMoreRef} className="h-20" />
      )}
    </div>
  );
};

/**
 * 로딩 Skeleton (태블릿)
 * Grid 5열
 */
const ShortPopularRecipesSectionSkeleton = () => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {Array.from({ length: 10 }, (_, index) => (
        <ShortsRecipeCardSkeleton key={index} isTablet={true} />
      ))}
    </div>
  );
};
