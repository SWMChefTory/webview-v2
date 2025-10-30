import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useFetchTrendingRecipes } from "../entities/trend-recipe/model/useTrendRecipe";
import { ThemeRecipe } from "@/src/pages/home/entities/theme-recipe/type";
import { useCreateRecipe } from "@/src/entities/user_recipe/model/useUserRecipe";
import { Skeleton } from "@/components/ui/skeleton";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import Trend from "@/src/pages/home/ui/assets/trend.png";
import { RecipeCreateDialog } from "@/src/widgets/recipe-search-view";

export const TrendRecipeSection = () => {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-gray-900">급상승 레시피</h2>
        <img src={Trend.src} className="size-5" alt="trend" />
      </div>
      <p className="text-xs text-gray-500">최근 급상승 레시피를 모아봤어요</p>
      <div className="grid grid-cols-2 gap-3 pt-1">
        <SSRSuspense fallback={<TrendRecipeGridSkeleton />}>
          <TrendRecipeGrid />
        </SSRSuspense>
      </div>
    </section>
  );
};

const TrendRecipeGrid = () => {
  const {
    data: recipes,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFetchTrendingRecipes();
  const loadMoreRef = useRef<HTMLDivElement>(null);

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
      <div className="col-span-2">
        <p className="text-sm text-gray-500 py-6 text-center">
          급상승 레시피가 없습니다
        </p>
      </div>
    );
  }

  return (
    <>
      {recipes.map((recipe) => (
        <TrendRecipeCardReady key={recipe.recipeId} recipe={recipe} />
      ))}
      {isFetchingNextPage && (
        <>
          <TrendRecipeCardSkeleton />
          <TrendRecipeCardSkeleton />
        </>
      )}
      {hasNextPage && !isFetchingNextPage && (
        <div ref={loadMoreRef} className="col-span-2 h-10" />
      )}
    </>
  );
};

const TrendRecipeCardReady = ({ recipe }: { recipe: ThemeRecipe }) => {
  const { create } = useCreateRecipe();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleCardClick = () => {
    if (!recipe.isViewed) {
      setIsOpen(true);
    } else {
      router.push(`/recipe/${recipe.recipeId}/detail`);
    }
  };

  const handleConfirm = async () => {
    await create({ youtubeUrl: recipe.videoUrl });
    router.push(`/recipe/${recipe.recipeId}/detail`);
    setIsOpen(false);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="flex flex-col w-full cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-lg h-[140px] bg-gray-100">
          <img
            src={recipe.videoThumbnailUrl}
            className="block w-full h-full object-cover"
            alt={recipe.recipeTitle}
          />
          {recipe.isViewed && (
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-white font-medium z-10">
              이미 등록
            </div>
          )}
        </div>
        <h3 className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
          {recipe.recipeTitle}
        </h3>
      </div>
      <RecipeCreateDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        recipeTitle={recipe.recipeTitle}
        onConfirm={handleConfirm}
      />
    </>
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

const TrendRecipeCardSkeleton = () => {
  return (
    <div className="flex flex-col w-full">
      <Skeleton className="w-full h-[140px] rounded-lg" />
      <div className="mt-2 space-y-1.5">
        <Skeleton className="w-full h-3.5 rounded" />
        <Skeleton className="w-3/4 h-3.5 rounded" />
      </div>
    </div>
  );
};

