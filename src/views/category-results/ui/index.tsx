import {
  ThumbnailSkeleton,
  ThumbnailReady,
} from "../../search-results/ui/thumbnail";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import {
  useFetchCuisineRecipes,
  CuisineRecipe,
} from "@/src/entities/cuisine-recipe/model/useCuisineRecipe";
import {
  useFetchRecommendRecipes,
} from "@/src/entities/recommend-recipe/model/useRecommendRecipe";
import { FaRegClock } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import { useEffect, useRef } from "react";

import { useCategoryTranslation } from "@/src/entities/category/hooks/useCategoryTranslation";
import { VideoType } from "@/src/entities/recommend-recipe/type/videoType";
import { useCategoryResultsTranslation } from "@/src/entities/category-results/hooks/useCategoryResultsTranslation";
import { RecipeCardWrapper } from "@/src/widgets/recipe-creating-modal/recipeCardWrapper";

import {
  toCuisineType,
  CuisineType
} from "@/src/entities/category/type/cuisineType"
import {
  RecommendType,
  toRecommendType,
} from "@/src/entities/recommend-recipe/type/recommendType";
import { RecommendRecipe } from "@/src/entities/recommend-recipe/api/api";

export function CategoryResultsSkeleton() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="px-4 md:px-6 py-6">
        <TextSkeleton fontSize="text-2xl" />
      </div>
      <div className="px-4 md:px-6 pb-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <RecipeCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategoryResultsContent({
  categoryType,
}: {
  categoryType: string;
}) {
  // 타입에 따라 다른 컴포넌트 렌더링
  const recommendType = toRecommendType(categoryType);
  if (recommendType) {
    return <RecommendCategoryContent recommendType={recommendType} />;
  }
  const causinType = toCuisineType(categoryType);
  if (causinType) {
    return <CuisineCategoryContent cuisineType={causinType} />;
  }
  throw new Error("지원되지 않는 타입");
}

function RecommendCategoryContent({
  recommendType,
}: {
  recommendType: RecommendType;
}) {
  const {
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    entities
  } = useFetchRecommendRecipes({ recommendType });
  const { t: categoryT } = useCategoryTranslation();
  const categoryName = categoryT(`recommend.${recommendType}`);

  return (
    <RecipeCardSection
      recipes={entities}
      onScroll={(entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      categoryName={categoryName}
      isFetchingNextPage={isFetchingNextPage}
      isRecommendType={true}
    />
  );
}

function CuisineCategoryContent({ cuisineType }: { cuisineType: CuisineType }) {
  const {
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    entities
  } = useFetchCuisineRecipes({ cuisineType });

  const { t: categoryT } = useCategoryTranslation();
  const categoryName = categoryT(`cuisine.${cuisineType}`);

  return (
    <RecipeCardSection
      recipes={entities}
      onScroll={(entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      categoryName={categoryName}
      isFetchingNextPage={isFetchingNextPage}
      isRecommendType={false}
    />
  );
}

const RecipeCardSection = ({
  recipes,
  onScroll,
  categoryName,
  isFetchingNextPage,
  isRecommendType,
}: {
  recipes: CuisineRecipe[] | RecommendRecipe[];
  onScroll: IntersectionObserverCallback;
  categoryName: string;
  isFetchingNextPage: boolean;
  isRecommendType: boolean;
}) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { t } = useCategoryResultsTranslation();

  useEffect(() => {
    const loadMore = loadMoreRef.current;

    if (!loadMore) return;

    const observer = new IntersectionObserver(onScroll, {
      threshold: 0.1,
      rootMargin: "200px",
    });

    observer.observe(loadMore);

    return () => observer.disconnect();
  }, [onScroll]);

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center pt-50 px-4">
        <div className="w-40 h-40 mb-8">
          <img
            src={"/empty_state.png"}
            alt="empty inbox"
            className="block w-full h-full object-contain"
          />
        </div>
        <div className="text-center space-y-3">
          <h3 className="font-bold text-xl text-gray-900">
            {t("empty.title")}
          </h3>
          <p className="text-s text-gray-600">{t("empty.subtitle")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      {/* 카테고리 결과 헤더 */}
      <div className="px-4 md:px-6 py-6">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-bold text-gray-900 truncate">
            {categoryName}
          </h1>
          <span className="text-lg font-medium text-gray-600 shrink-0">
            {t("header.suffix")}
          </span>
        </div>
        {/* <p className="text-sm text-gray-500 mt-2">
          {t("header.totalCount", { count: totalElements })}
        </p> */}
      </div>

      {/* 레시피 그리드 */}
      <div className="px-4 md:px-6 pb-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCardWrapper
              key={recipe.recipeId}
              recipeCreditCost={recipe.creditCost}
              recipeId={recipe.recipeId}
              recipeTitle={recipe.recipeTitle}
              recipeIsViewed={recipe.isViewed ?? false}
              recipeVideoType={
                recipe.videoInfo.videoType == "SHORTS"
                  ? VideoType.SHORTS
                  : VideoType.NORMAL
              }
              entryPoint={
                isRecommendType ? "category_recommend" : "category_cuisine"
              }
              recipeVideoUrl={`https://www.youtube.com/watch?v=${recipe.videoInfo.videoId}`}
              trigger={
                <RecipeCardReady
                  recipeTitle={recipe.recipeTitle}
                  videoThumbnailUrl={recipe.videoInfo.videoThumbnailUrl}
                  isViewed={recipe.isViewed ?? false}
                  servings={recipe.detailMeta?.servings ?? 0}
                  cookingTime={recipe.detailMeta?.cookingTime ?? 0}
                  tags={recipe.tags ?? []}
                  description={recipe.detailMeta?.description ?? ""}
                />
              }
            />
          ))}

          {isFetchingNextPage && (
            <>
              <RecipeCardSkeleton />
              <RecipeCardSkeleton />
            </>
          )}
        </div>
        <div ref={loadMoreRef} className="h-20" />
      </div>
    </div>
  );
};

type RecipeCardProps = {
  recipeTitle: string;
  videoThumbnailUrl?: string;
  isViewed: boolean;
  servings: number;
  cookingTime: number;
  tags: { name: string }[];
  description: string;
};

const RecipeCardReady = ({
  recipeTitle,
  videoThumbnailUrl,
  isViewed,
  servings,
  cookingTime,
  tags,
  description,
}: RecipeCardProps) => {
  const { t } = useCategoryResultsTranslation();

  return (
    <article className="w-full group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-200">
        <ThumbnailReady imgUrl={videoThumbnailUrl || ""} />
        {isViewed && (
          <div className="absolute top-2 left-2 bg-stone-600/50 px-2 py-1 rounded-full text-xs text-white z-10">
            {t("card.badge")}
          </div>
        )}
      </div>

      <div className="mt-3 space-y-2.5">
        <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
          {recipeTitle}
        </h3>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <BsPeople size={14} className="shrink-0" />
            <span className="font-medium">
              {t("card.serving", { count: servings })}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <FaRegClock size={14} className="shrink-0" />
            <span className="font-medium">
              {t("card.minute", { count: cookingTime })}
            </span>
          </div>
        </div>

        {!!tags?.length && (
          <div className="flex gap-2 overflow-hidden">
            <div className="flex gap-2 line-clamp-1">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs font-semibold text-orange-600 whitespace-nowrap"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.75rem]">
          {description}
        </p>
      </div>
    </article>
  );
};


const RecipeCardSkeleton = () => {
  return (
    <div className="w-full">
      <div className="rounded-xl overflow-hidden">
        <ThumbnailSkeleton />
      </div>
      <div className="mt-3 space-y-2.5">
        <TextSkeleton fontSize="text-base" />
        <div className="flex gap-3">
          <TextSkeleton fontSize="text-sm" />
          <TextSkeleton fontSize="text-sm" />
        </div>
        <TextSkeleton fontSize="text-sm" />
        <TextSkeleton fontSize="text-sm" />
      </div>
    </div>
  );
};
