import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { RecipeCardWrapper } from "@/src/widgets/recipe-creating-modal/recipeCardWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, List } from "lucide-react";
import { useMemo, useState } from "react";
import { BsPeople } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa";
import { useCategoryResultsController } from "./CategoryResults.controller";
import { RecipeCardSkeleton, EmptyState } from "./CategoryResults.common";
import { RecipeCardsSectionMobile } from "@/src/widgets/recipe-cards-section";
import { VideoType } from "@/src/entities/schema";

export function CategoryResultsSkeletonMobile() {
  return (
    <div className="flex flex-col w-full min-h-screen ">
      <div className="px-4 py-6">
        <TextSkeleton fontSize="text-2xl" />
      </div>
      <div className="px-2 pb-6">
        <div className="flex flex-wrap justify-between gap-y-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <RecipeGridCardShortsSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RecipeGridCardShortsSkeleton() {
  return (
    <div className="w-[48%] rounded-2xl overflow-hidden bg-gray-200/60 aspect-[9/16] relative">
      <Skeleton className="absolute inset-0 h-full w-full rounded-none" />

      <div className="absolute top-2 left-2 flex items-center gap-2">
        <Skeleton className="h-6 w-14 rounded-full bg-gray-300/70" />
        <Skeleton className="h-6 w-14 rounded-full bg-gray-300/70" />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      <div className="absolute bottom-2 left-2 right-2 space-y-1">
        <Skeleton className="h-3 w-3/4 rounded bg-gray-300/70" />
        <Skeleton className="h-3 w-1/2 rounded bg-gray-300/70" />
      </div>
    </div>
  );
}

export function CategoryResultsContentMobile({
  categoryType,
  videoType,
}: {
  categoryType: string;
  videoType?: string;
}) {
  const {
    recipes,
    isFetchingNextPage,
    loadMoreRef,
    t,
    getVideoType,
    getEntryPoint,
    getVideoUrl,
  } = useCategoryResultsController(categoryType, "mobile", videoType);

  if (recipes.length === 0) {
    return <EmptyState t={t} />;
  }

  type ViewMode = "list" | "grid";
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const content = useMemo(() => {
    if (viewMode === "list") {
      return (
        <div className="space-y-6 w-full">
          {recipes.map((recipe) => (
            <div key={recipe.recipeId} className="w-full">
              <RecipeCardWrapper
                recipeCreditCost={recipe.creditCost}
                recipeId={recipe.recipeId}
                recipeTitle={recipe.recipeTitle}
                recipeIsViewed={recipe.isViewed ?? false}
                recipeVideoType={recipe.videoInfo.videoType === "SHORTS" ? VideoType.SHORTS : VideoType.NORMAL}
                entryPoint={getEntryPoint()}
                recipeVideoUrl={getVideoUrl(recipe)}
                trigger={
                  recipe.videoInfo.videoType === "SHORTS" ? (
                    <RecipeListCardShorts
                      t={t}
                      recipeTitle={recipe.recipeTitle}
                      videoThumbnailUrl={recipe.videoInfo.videoThumbnailUrl}
                      isViewed={recipe.isViewed ?? false}
                      servings={recipe.detailMeta?.servings ?? 0}
                      cookingTime={recipe.detailMeta?.cookingTime ?? 0}
                      tags={recipe.tags ?? []}
                      description={recipe.detailMeta?.description ?? ""}
                    />
                  ) : (
                    <RecipeListCardNormal
                      t={t}
                      recipeTitle={recipe.recipeTitle}
                      videoThumbnailUrl={recipe.videoInfo.videoThumbnailUrl}
                      isViewed={recipe.isViewed ?? false}
                      servings={recipe.detailMeta?.servings ?? 0}
                      cookingTime={recipe.detailMeta?.cookingTime ?? 0}
                      tags={recipe.tags ?? []}
                      description={recipe.detailMeta?.description ?? ""}
                    />
                  )
                }
              />
            </div>
          ))}

          {isFetchingNextPage && (
            <>
              <div className="w-full">
                <RecipeListCardNormalSkeleton />
              </div>
              <div className="w-full">
                <RecipeListCardNormalSkeleton />
              </div>
            </>
          )}

          <div ref={loadMoreRef} className="h-24" />
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-2 gap-1 w-full justify-items-stretch">
          {recipes.map((recipe) => (
            <div key={recipe.recipeId}>
              <RecipeCardWrapper
                recipeCreditCost={recipe.creditCost}
                recipeId={recipe.recipeId}
                recipeTitle={recipe.recipeTitle}
                recipeIsViewed={recipe.isViewed ?? false}
                recipeVideoType={recipe.videoInfo.videoType === "SHORTS" ? VideoType.SHORTS : VideoType.NORMAL}
                entryPoint={getEntryPoint()}
                recipeVideoUrl={getVideoUrl(recipe)}
                trigger={
                  recipe.videoInfo.videoType === "SHORTS" ? (
                    <RecipeGridCardShorts
                      t={t}
                      recipeTitle={recipe.recipeTitle}
                      videoThumbnailUrl={recipe.videoInfo.videoThumbnailUrl}
                      servings={recipe.detailMeta?.servings ?? 0}
                      cookingTime={recipe.detailMeta?.cookingTime ?? 0}
                    />
                  ) : (
                    <RecipeGridCardNormal
                      t={t}
                      recipeTitle={recipe.recipeTitle}
                      videoThumbnailUrl={recipe.videoInfo.videoThumbnailUrl}
                      servings={recipe.detailMeta?.servings ?? 0}
                      cookingTime={recipe.detailMeta?.cookingTime ?? 0}
                      tags={recipe.tags ?? []}
                      description={recipe.detailMeta?.description ?? ""}
                    />
                  )
                }
              />
            </div>
          ))}

          {isFetchingNextPage && (
            <>
              <div className="w-full">
                <RecipeCardSkeleton />
              </div>
              <div className="w-full">
                <RecipeCardSkeleton />
              </div>
            </>
          )}
        </div>
        <div ref={loadMoreRef} className="h-24" />
      </>
    );
  }, [
    getEntryPoint,
    getVideoType,
    getVideoUrl,
    isFetchingNextPage,
    loadMoreRef,
    recipes,
    viewMode,
  ]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="px-2 pb-28 pt-4">
        <RecipeCardsSectionMobile
          recipes={recipes}
          loadMoreRef={loadMoreRef}
          isFetchingNextPage={isFetchingNextPage}
          entryPoint={getEntryPoint()}
          getVideoType={(recipe) =>
            recipe.videoInfo.videoType === "SHORTS" ? VideoType.SHORTS : VideoType.NORMAL
          }
          getVideoUrl={getVideoUrl}
          cardBadge={t("card.badge")}
          cardServing={(count) => t("card.serving", { count })}
          cardMinute={(count) => t("card.minute", { count })}
          defaultViewMode={viewMode}
        />
      </div>
    </div>
  );
}

function MetaPills({
  t,
  servings,
  cookingTime,
}: {
  t: (key: string, options?: Record<string, unknown>) => string;
  servings: number;
  cookingTime: number;
}) {
  return (
    <div className="flex gap-2">
      <div className="inline-flex items-center gap-1 rounded-tl-xl rounded-br-xl rounded-bl-xl bg-orange-500 px-2.5 py-1 text-xs font-semibold text-white">
        <BsPeople className="h-3.5 w-3.5" />
        <span className="leading-none">
          {t("card.serving", { count: servings })}
        </span>
      </div>
      <div className="inline-flex items-center gap-1 rounded-full bg-gray-800/80 px-2.5 py-1 text-xs font-semibold text-white">
        <FaRegClock className="h-3.5 w-3.5" />
        <span className="leading-none">
          {t("card.minute", { count: cookingTime })}
        </span>
      </div>
    </div>
  );
}

function TagRow({ tags }: { tags: { name: string }[] }) {
  if (!tags.length) return null;
  return (
    <div className="flex gap-2 overflow-hidden">
      <div className="flex gap-2 line-clamp-1">
        {tags.slice(0, 2).map((tag, index) => (
          <span
            key={`${tag.name}-${index}`}
            className="text-xs font-semibold text-gray-700 whitespace-nowrap"
          >
            #{tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function RecipeGridCardNormal({
  t,
  recipeTitle,
  videoThumbnailUrl,
  servings,
  cookingTime,
  tags,
  description,
}: {
  t: (key: string, options?: Record<string, unknown>) => string;
  recipeTitle: string;
  videoThumbnailUrl?: string;
  servings: number;
  cookingTime: number;
  tags: { name: string }[];
  description: string;
}) {
  return (
    <div className="w-full rounded-2xl bg-white overflow-hidden flex flex-col border border-gray-100">
      <div className="relative w-full aspect-[16/9]">
        <img
          src={videoThumbnailUrl || ""}
          alt={recipeTitle}
          className="absolute insets-0"
        />
      </div>

      <div className="flex-1 px-1.5 pb-3 pt-2 flex flex-col">
        <div className="flex justify-start">
          <MetaPills t={t} servings={servings} cookingTime={cookingTime} />
        </div>
        <h3 className="pt-2 px-0.5 text-sm font-semibold text-gray-900 line-clamp-3">
          {recipeTitle}
        </h3>
        <p className="px-0.5 text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="pt-2">
          <TagRow tags={tags} />
        </div>
      </div>
    </div>
  );
}

function RecipeGridCardShorts({
  t,
  recipeTitle,
  videoThumbnailUrl,
  servings,
  cookingTime,
}: {
  t: (key: string, options?: Record<string, unknown>) => string;
  recipeTitle: string;
  videoThumbnailUrl?: string;
  servings: number;
  cookingTime: number;
}) {
  return (
    <div className="rounded-2xl relative w-full aspect-[9/16] overflow-hidden bg-white">
      <img
        src={videoThumbnailUrl || ""}
        alt={recipeTitle}
        className="absolute rounded-2xl insets-0 h-full w-full object-cover"
      />
      <div className="absolute top-2 left-2">
        <MetaPills t={t} servings={servings} cookingTime={cookingTime} />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-2 left-2 right-2">
        <div className="text-xs font-semibold text-white line-clamp-2">
          {recipeTitle}
        </div>
      </div>
    </div>
  );
}

function RecipeListCardShorts({
  t,
  recipeTitle,
  videoThumbnailUrl,
  isViewed,
  servings,
  cookingTime,
  tags,
  description,
}: {
  t: (key: string, options?: Record<string, unknown>) => string;
  recipeTitle: string;
  videoThumbnailUrl?: string;
  isViewed: boolean;
  servings: number;
  cookingTime: number;
  tags: { name: string }[];
  description: string;
}) {
  return (
    <article className="w-full">
      <div className="rounded-2xl w-full bg-white overflow-hidden border border-gray-100">
        <div className="flex w-full px-1 py-1">
          <div className="relative rounded-lg w-[36%] aspect-[9/16] overflow-hidden shrink-0">
            <img
              src={videoThumbnailUrl || ""}
              alt={recipeTitle}
              className="absolute insets-0 h-full w-full object-cover object-center scale-120"
            />
          </div>
          <div className="flex flex-col flex-1 p-3">
            <div className="flex flex-1 items-start justify-between gap-3">
              <MetaPills t={t} servings={servings} cookingTime={cookingTime} />
            </div>
            <h3 className="mt-2 text-sm flex-2 font-bold text-gray-900 line-clamp-2">
              {recipeTitle}
            </h3>
            <p className="mt-2 text-xs flex-2 text-gray-600 line-clamp-2 leading-relaxed">
              {description}
            </p>
            <div className="mt-2 flex-0.5">
              <TagRow tags={tags} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function RecipeListCardNormal({
  t,
  recipeTitle,
  videoThumbnailUrl,
  isViewed,
  servings,
  cookingTime,
  tags,
  description,
}: {
  t: (key: string, options?: Record<string, unknown>) => string;
  recipeTitle: string;
  videoThumbnailUrl?: string;
  isViewed: boolean;
  servings: number;
  cookingTime: number;
  tags: { name: string }[];
  description: string;
}) {
  return (
    <article className="w-full">
      <div className="rounded-2xl bg-white overflow-hidden border border-gray-100">
        <div className="relative w-full  aspect-[16/9]">
          <img
            src={videoThumbnailUrl || ""}
            alt={recipeTitle}
            className="absolute insets-0"
          />
        </div>
        <div className="p-2">
          <div className="flex items-start justify-between gap-3">
            <MetaPills t={t} servings={servings} cookingTime={cookingTime} />
          </div>
          <h3 className="pt-2 px-1 text-sm font-semibold text-gray-900 line-clamp-3">
            {recipeTitle}
          </h3>
          <p className="mt-2 px-1 text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
          <div className="mt-3 px-1">
            <TagRow tags={tags} />
          </div>
        </div>
      </div>
    </article>
  );
}

function RecipeListCardNormalSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-white overflow-hidden border border-gray-100">
      <div className="relative w-full aspect-[16/9]">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none bg-gray-200" />
      </div>
      <div className="p-2">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-6 w-14 rounded-full bg-gray-300/70" />
          <Skeleton className="h-6 w-14 rounded-full bg-gray-300/70" />
        </div>
        <div className="pt-2 px-1 space-y-2">
          <Skeleton className="h-4 w-4/5 rounded bg-gray-200" />
          <Skeleton className="h-4 w-3/5 rounded bg-gray-200" />
        </div>
        <div className="mt-2 px-1 space-y-2">
          <Skeleton className="h-3 w-full rounded bg-gray-200" />
          <Skeleton className="h-3 w-2/3 rounded bg-gray-200" />
        </div>
        <div className="mt-3 px-1 flex gap-2">
          <Skeleton className="h-3 w-14 rounded bg-gray-200" />
          <Skeleton className="h-3 w-14 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function RecipeListCardSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-white overflow-hidden border border-gray-100">
      <div className="flex">
        <div className="h-[110px] w-[140px] shrink-0 bg-gray-200" />
        <div className="flex-1 p-3 space-y-2">
          <div className="h-5 w-28 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
