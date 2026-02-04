import { useMemo, useState } from "react";

import { LayoutGrid, List } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { VideoType } from "@/src/entities/recommend-recipe/type/videoType";
import type { RecipeCardEntryPoint } from "@/src/widgets/recipe-creating-modal/recipeCardWrapper";
import { RecipeCardWrapper } from "@/src/widgets/recipe-creating-modal/recipeCardWrapper";

type Tag = { name: string };

export type RecipeCardsSectionRecipe = {
  recipeId: string;
  recipeTitle: string;
  creditCost: number;
  isViewed?: boolean;
  tags?: Tag[];
  videoInfo: {
    videoThumbnailUrl: string;
    videoType: "SHORTS" | "NORMAL";
  };
  detailMeta?: {
    description?: string;
    servings?: number;
    cookingTime?: number;
  };
};

type ViewMode = "list" | "grid";

export function RecipeCardsSectionMobile<TRecipe extends RecipeCardsSectionRecipe>({
  recipes,
  loadMoreRef,
  isFetchingNextPage,
  entryPoint,
  getVideoType,
  getVideoUrl,
  cardBadge,
  cardServing,
  cardMinute,
  defaultViewMode = "grid",
}: {
  recipes: TRecipe[];
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isFetchingNextPage: boolean;
  entryPoint: RecipeCardEntryPoint;
  getVideoType: (recipe: TRecipe) => VideoType;
  getVideoUrl: (recipe: TRecipe) => string;
  cardBadge: string;
  cardServing: (count: number) => string;
  cardMinute: (count: number) => string;
  defaultViewMode?: ViewMode;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);

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
                recipeVideoType={getVideoType(recipe)}
                entryPoint={entryPoint}
                recipeVideoUrl={getVideoUrl(recipe)}
                trigger={
                  recipe.videoInfo.videoType === "SHORTS" ? (
                    <RecipeListCardShorts
                      cardBadge={cardBadge}
                      cardServing={cardServing}
                      cardMinute={cardMinute}
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
                      cardBadge={cardBadge}
                      cardServing={cardServing}
                      cardMinute={cardMinute}
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
        <div className="flex flex-wrap justify-between gap-y-6 w-full">
          {recipes.map((recipe) => (
            <div key={recipe.recipeId} className="w-[48%]">
              <RecipeCardWrapper
                recipeCreditCost={recipe.creditCost}
                recipeId={recipe.recipeId}
                recipeTitle={recipe.recipeTitle}
                recipeIsViewed={recipe.isViewed ?? false}
                recipeVideoType={getVideoType(recipe)}
                entryPoint={entryPoint}
                recipeVideoUrl={getVideoUrl(recipe)}
                trigger={
                  recipe.videoInfo.videoType === "SHORTS" ? (
                    <RecipeGridCardShorts
                      cardServing={cardServing}
                      cardMinute={cardMinute}
                      recipeTitle={recipe.recipeTitle}
                      videoThumbnailUrl={recipe.videoInfo.videoThumbnailUrl}
                      servings={recipe.detailMeta?.servings ?? 0}
                      cookingTime={recipe.detailMeta?.cookingTime ?? 0}
                    />
                  ) : (
                    <RecipeGridCardNormal
                      cardServing={cardServing}
                      cardMinute={cardMinute}
                      recipeTitle={recipe.recipeTitle}
                      videoThumbnailUrl={recipe.videoInfo.videoThumbnailUrl}
                      servings={recipe.detailMeta?.servings ?? 0}
                      cookingTime={recipe.detailMeta?.cookingTime ?? 0}
                      tags={recipe.tags ?? []}
                    />
                  )
                }
              />
            </div>
          ))}

          {isFetchingNextPage && (
            <>
              <div className="w-[48%]">
                <RecipeGridCardShortsSkeleton />
              </div>
              <div className="w-[48%]">
                <RecipeGridCardShortsSkeleton />
              </div>
            </>
          )}
        </div>
        <div ref={loadMoreRef} className="h-24" />
      </>
    );
  }, [
    cardBadge,
    cardMinute,
    cardServing,
    entryPoint,
    getVideoType,
    getVideoUrl,
    isFetchingNextPage,
    loadMoreRef,
    recipes,
    viewMode,
  ]);

  return (
    <>
      {content}

      <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center pb-safe">
        <div className="bg-white/90 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.16)] rounded-2xl p-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setViewMode("grid")}
              className={
                viewMode === "grid"
                  ? "h-11 w-11 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center"
                  : "h-11 w-11 rounded-xl text-gray-500 flex items-center justify-center"
              }
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => setViewMode("list")}
              className={
                viewMode === "list"
                  ? "h-11 w-11 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center"
                  : "h-11 w-11 rounded-xl text-gray-500 flex items-center justify-center"
              }
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function MetaPills({
  cardServing,
  cardMinute,
  servings,
  cookingTime,
}: {
  cardServing: (count: number) => string;
  cardMinute: (count: number) => string;
  servings: number;
  cookingTime: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
        <span className="leading-none">{cardServing(servings)}</span>
      </div>
      <div className="inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
        <span className="leading-none">{cardMinute(cookingTime)}</span>
      </div>
    </div>
  );
}

function TagRow({ tags }: { tags: Tag[] }) {
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
  cardServing,
  cardMinute,
  recipeTitle,
  videoThumbnailUrl,
  servings,
  cookingTime,
  tags,
}: {
  cardServing: (count: number) => string;
  cardMinute: (count: number) => string;
  recipeTitle: string;
  videoThumbnailUrl?: string;
  servings: number;
  cookingTime: number;
  tags: Tag[];
}) {
  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100 aspect-[9/16] flex flex-col">
      <div className="relative">
        <img
          src={videoThumbnailUrl || ""}
          alt={recipeTitle}
          className="block w-full h-[96px] object-cover"
        />
      </div>

      <div className="flex-1 px-3 pb-3 pt-2 flex flex-col">
        <div className="flex justify-start">
          <MetaPills
            cardServing={cardServing}
            cardMinute={cardMinute}
            servings={servings}
            cookingTime={cookingTime}
          />
        </div>
        <h3 className="mt-2 text-sm font-bold text-gray-900 line-clamp-2">
          {recipeTitle}
        </h3>
        <div className="mt-auto pt-2">
          <TagRow tags={tags} />
        </div>
      </div>
    </div>
  );
}

function RecipeGridCardShorts({
  cardServing,
  cardMinute,
  recipeTitle,
  videoThumbnailUrl,
  servings,
  cookingTime,
}: {
  cardServing: (count: number) => string;
  cardMinute: (count: number) => string;
  recipeTitle: string;
  videoThumbnailUrl?: string;
  servings: number;
  cookingTime: number;
}) {
  return (
    <div className="rounded-2xl overflow-hidden bg-black shadow-sm border border-gray-100">
      <div className="relative aspect-[9/16]">
        <img
          src={videoThumbnailUrl || ""}
          alt={recipeTitle}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <MetaPills
            cardServing={cardServing}
            cardMinute={cardMinute}
            servings={servings}
            cookingTime={cookingTime}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <div className="text-xs font-semibold text-white line-clamp-2">
            {recipeTitle}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecipeListCardShorts({
  cardBadge,
  cardServing,
  cardMinute,
  recipeTitle,
  videoThumbnailUrl,
  isViewed,
  servings,
  cookingTime,
  tags,
  description,
}: {
  cardBadge: string;
  cardServing: (count: number) => string;
  cardMinute: (count: number) => string;
  recipeTitle: string;
  videoThumbnailUrl?: string;
  isViewed: boolean;
  servings: number;
  cookingTime: number;
  tags: Tag[];
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
              className="absolute inset-0 h-full w-full object-cover object-center scale-120"
            />
            {isViewed && (
              <div className="absolute bottom-2 left-2 rounded-full bg-stone-600/50 px-2 py-1 text-[11px] font-semibold text-white">
                {cardBadge}
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 p-3">
            <div className="flex flex-1 items-start justify-between gap-3">
              <MetaPills
                cardServing={cardServing}
                cardMinute={cardMinute}
                servings={servings}
                cookingTime={cookingTime}
              />
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
  cardBadge,
  cardServing,
  cardMinute,
  recipeTitle,
  videoThumbnailUrl,
  isViewed,
  servings,
  cookingTime,
  tags,
  description,
}: {
  cardBadge: string;
  cardServing: (count: number) => string;
  cardMinute: (count: number) => string;
  recipeTitle: string;
  videoThumbnailUrl?: string;
  isViewed: boolean;
  servings: number;
  cookingTime: number;
  tags: Tag[];
  description: string;
}) {
  return (
    <article className="w-full">
      <div className="rounded-2xl bg-white overflow-hidden border border-gray-100">
        <div className="relative w-full aspect-[16/9]">
          <img
            src={videoThumbnailUrl || ""}
            alt={recipeTitle}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <MetaPills
              cardServing={cardServing}
              cardMinute={cardMinute}
              servings={servings}
              cookingTime={cookingTime}
            />
          </div>
          {isViewed && (
            <div className="absolute bottom-2 left-2 rounded-full bg-stone-600/50 px-2 py-1 text-[11px] font-semibold text-white">
              {cardBadge}
            </div>
          )}
        </div>
        <div className="p-2">
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
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <Skeleton className="h-6 w-14 rounded-full bg-gray-300/70" />
          <Skeleton className="h-6 w-14 rounded-full bg-gray-300/70" />
        </div>
      </div>
      <div className="p-2">
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

function RecipeGridCardShortsSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-gray-200/60 aspect-[9/16] relative">
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
