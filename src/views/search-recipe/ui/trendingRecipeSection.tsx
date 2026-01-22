import { useEffect, useRef } from "react";
import { useFetchTrendingRecipes } from "../entities/trend-recipe/model/useTrendRecipe";
import { useSearchOverlayTranslation } from "../hooks/useSearchOverlayTranslation";
import { Skeleton } from "@/components/ui/skeleton";
import { RecipeCardWrapper } from "@/src/widgets/recipe-create-dialog/recipeCardWrapper";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import Trend from "@/src/views/home/ui/assets/trend.png";

const TrendRecipeGrid = () => {
  const {
    data: recipes,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFetchTrendingRecipes();
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
        rootMargin: "50px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (recipes.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 2xl:gap-8">
        <div className="col-span-2">
          <p className="text-sm text-gray-500 py-6">
            {t("trendingRecipe.empty")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 2xl:gap-8">
      {recipes.map((recipe) => (
        <RecipeCardWrapper
          key={recipe.recipeId}
          recipeId={recipe.recipeId}
          recipeCreditCost={recipe.creditCost}
          recipeIsViewed={recipe.isViewed}
          recipeTitle={recipe.recipeTitle}
          recipeVideoType={recipe.videoType}
          recipeVideoUrl={recipe.videoUrl}
          trigger={
            <TrendRecipeCard
              videoThumbnailUrl={recipe.videoThumbnailUrl}
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
      <div className="relative overflow-hidden rounded-xl shadow-sm md:shadow-md group-hover:shadow-md md:group-hover:shadow-lg md:group-hover:scale-[1.02] transition-all duration-200 h-[160px] md:h-[180px] lg:h-[200px] xl:h-[220px] 2xl:h-[240px]">
        <img
          src={videoThumbnailUrl}
          className="block w-full h-full object-cover"
          alt={recipeTitle}
        />
        {isViewed && (
          <div className="absolute top-2 left-2 bg-stone-600/50 px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm text-white z-10">
            {t("trendingRecipe.badge")}
          </div>
        )}
      </div>
      <h3 className="mt-3 text-sm md:text-base lg:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
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
    <section className="space-y-4 md:space-y-5">
      <div className="flex items-center gap-2">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
          {t("trendingRecipe.title")}
        </h2>
        <img src={Trend.src} className="size-5 md:size-6" alt="trend" />
      </div>
      <p className="text-sm md:text-base lg:text-lg text-gray-500">{t("trendingRecipe.subtitle")}</p>
      <SSRSuspense fallback={<TrendRecipeGridSkeleton />}>
        <TrendRecipeGrid />
      </SSRSuspense>
    </section>
  );
};

const TrendRecipeCardSkeleton = () => {
  return (
    <div className="flex flex-col w-full">
      <Skeleton className="w-full h-[160px] md:h-[180px] lg:h-[200px] xl:h-[220px] 2xl:h-[240px] rounded-xl" />
      <div className="mt-3 space-y-2">
        <Skeleton className="w-full h-4 md:h-5 rounded" />
        <Skeleton className="w-3/4 h-4 md:h-5 rounded" />
      </div>
    </div>
  );
};
