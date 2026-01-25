import { useEffect, useRef } from "react";
import { useFetchRecommendRecipes } from "@/src/entities/recommend-recipe/model/useRecommendRecipe";
import { useSearchOverlayTranslation } from "../hooks/useSearchOverlayTranslation";
import { Skeleton } from "@/components/ui/skeleton";
import { RecipeCardWrapper } from "@/src/widgets/recipe-create-dialog/recipeCardWrapper";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import Trend from "@/src/views/home/ui/assets/trend.png";
import { RecommendType } from "@/src/entities/recommend-recipe/type/recommendType";
import { VideoType } from "@/src/entities/recommend-recipe/type/videoType";

const TrendRecipeGrid = () => {
  const {
    entities: recipes,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFetchRecommendRecipes({recommendType:RecommendType.TRENDING});
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { t } = useSearchOverlayTranslation();

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

  if (recipes.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        <div className="col-span-2">
          <p className="text-sm text-gray-500 py-6">
            {t("trendingRecipe.empty")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCardWrapper
          key={recipe.recipeId}
          recipeId={recipe.recipeId}
          recipeCreditCost={recipe.creditCost}
          recipeIsViewed={recipe.isViewed}
          recipeTitle={recipe.recipeTitle}
          recipeVideoType={VideoType.ALL}
          recipeVideoUrl={recipe.videoInfo.videoId}
          trigger={
            <TrendRecipeCard
              videoThumbnailUrl={recipe.videoInfo.videoThumbnailUrl}
              recipeTitle={recipe.recipeTitle}
              isViewed={recipe.isViewed}
            />
          }
          entryPoint={"search_trend"}
        />
      ))}
      {isFetchingNextPage && (
        <>
          <TrendRecipeCardSkeleton />
          <TrendRecipeCardSkeleton />
        </>
      )}
      {hasNextPage && !isFetchingNextPage && (
        <div ref={loadMoreRef} className="col-span-2 h-20" />
      )}
    </div>
  );
};

const TrendRecipeCard = ({
  videoThumbnailUrl,
  recipeTitle,
  isViewed,
}: {
  videoThumbnailUrl: string;
  recipeTitle: string;
  isViewed: boolean;
}) => {
  const { t } = useSearchOverlayTranslation();

  return (
    <div className="flex flex-col w-full group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-200 h-[160px]">
        <img
          src={videoThumbnailUrl}
          className="block w-full h-full object-cover"
          alt={recipeTitle}
        />
        {isViewed && (
          <div className="absolute top-2 left-2 bg-stone-600/50 px-2 py-1 rounded-full text-xs text-white z-10">
            {t("trendingRecipe.badge")}
          </div>
        )}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
        {recipeTitle}
      </h3>
    </div>
  );
};

const TrendRecipeGridSkeleton = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <TrendRecipeCardSkeleton key={index} />
      ))}
    </>
  );
};

export const TrendingRecipeSection = () => {
  const { t } = useSearchOverlayTranslation();
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-gray-900">
          {t("trendingRecipe.title")}
        </h2>
        <img src={Trend.src} className="size-5" alt="trend" />
      </div>
      <p className="text-sm text-gray-500">{t("trendingRecipe.subtitle")}</p>
      <SSRSuspense fallback={<TrendRecipeGridSkeleton />}>
        <TrendRecipeGrid />
      </SSRSuspense>
    </section>
  );
};

const TrendRecipeCardSkeleton = () => {
  return (
    <div className="flex flex-col w-full">
      <Skeleton className="w-full h-[160px] rounded-xl" />
      <div className="mt-3 space-y-2">
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-3/4 h-4 rounded" />
      </div>
    </div>
  );
};
