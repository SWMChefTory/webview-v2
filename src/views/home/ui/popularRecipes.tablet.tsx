import { useFecthPopularRecipe } from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { RecipeCardWrapper } from "../../../widgets/recipe-create-dialog/recipeCardWrapper";
import { useState, useEffect, useRef } from "react";
import {
  PopularRecipesTitleReady,
  RecipeCardReady,
  RecipeCardSkeleton,
} from "./popularRecipes.common";

/**
 * PopularRecipes 섹션 - 태블릿 버전 (768px ~)
 *
 * 특징:
 * - 레시피 목록: Grid 3열
 * - 무한 스크롤: IntersectionObserver
 * - 좌우 패딩: px-6
 * - 카드 width: w-full (Grid에 맞춤)
 */
export function PopularRecipesTablet() {
  return (
    <PopularRecipesTemplateTablet
      title={<PopularRecipesTitleReady />}
      recipeSection={
        <SSRSuspense fallback={<RecipeCardSectionSkeleton />}>
          <RecipeCardSectionReady />
        </SSRSuspense>
      }
    />
  );
}

/**
 * 태블릿 레이아웃 템플릿
 * 좌우 패딩 추가 (px-6)
 */
const PopularRecipesTemplateTablet = ({
  title,
  recipeSection,
}: {
  title: React.ReactNode;
  recipeSection: React.ReactNode;
}) => {
  return (
    <div className="px-6">
      <div className="h-4" />
      {title}
      <div className="h-4" />
      {recipeSection}
    </div>
  );
};

/**
 * 레시피 목록 섹션 (태블릿)
 * Grid 3열 + IntersectionObserver 무한 스크롤
 */
function RecipeCardSectionReady() {
  const {
    data: recipes,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFecthPopularRecipe(VideoType.NORMAL);

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
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-4 lg:gap-6">
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
            trigger={<RecipeCardReady recipe={recipe} isTablet={true} />}
          />
        ))}
        {isFetchingNextPage && (
          <>
            <RecipeCardSkeleton isTablet={true} />
            <RecipeCardSkeleton isTablet={true} />
            <RecipeCardSkeleton isTablet={true} />
          </>
        )}
      </div>
      {/* IntersectionObserver 타겟 */}
      {hasNextPage && !isFetchingNextPage && (
        <div ref={loadMoreRef} className="h-20" />
      )}
    </div>
  );
}

/**
 * 로딩 Skeleton (태블릿)
 * Grid 3열, 데스크탑 4열
 */
function RecipeCardSectionSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4 lg:grid-cols-4 lg:gap-6">
      {Array.from({ length: 6 }, (_, index) => (
        <RecipeCardSkeleton key={index} isTablet={true} />
      ))}
    </div>
  );
}
