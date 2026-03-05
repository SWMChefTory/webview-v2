import type React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/router";
import { navigateToRecipeDetail } from "@/src/shared/navigation/navigateToRecipeDetail";

type Tag = { name: string };

export type RecipeCardsSectionRecipe = {
  recipeId: string;
  recipeTitle: string;
  creditCost: number;
  isViewed?: boolean;
  tags?: Tag[];
  videoInfo: {
    videoId: string;
    videoThumbnailUrl: string;
    videoType: "SHORTS" | "NORMAL";
  };
  detailMeta?: {
    description?: string;
    servings?: number;
    cookingTime?: number;
  };
};

export function ShortsRecipeListMobile<
  TRecipe extends RecipeCardsSectionRecipe
>({
  recipes,
  onRecipeClick,
  cardServing,
  cardMinute,
  observeRef,
}: {
  recipes: TRecipe[];
  onRecipeClick?: (recipe: TRecipe) => void;
  cardServing: (count: number) => string;
  cardMinute: (count: number) => string;
  observeRef?: (el: HTMLDivElement | null, recipeId: string, index: number) => void;
}) {
  const router = useRouter();

  if (recipes.length === 0) return null;

  return (
    <section className="mb-6">
      <div
        className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {recipes.map((recipe, index) => (
          <div
            key={recipe.recipeId}
            ref={(el) => observeRef?.(el, recipe.recipeId, index)}
            className="w-[150px] shrink-0 snap-start cursor-pointer"
            onClick={() => {
              onRecipeClick?.(recipe);
              navigateToRecipeDetail(router, {
                recipeId: recipe.recipeId,
                recipeTitle: recipe.recipeTitle,
                videoId: recipe.videoInfo.videoId,
                description: recipe.detailMeta?.description,
                servings: recipe.detailMeta?.servings,
                cookingTime: recipe.detailMeta?.cookingTime,
              });
            }}
          >
            <RecipeCardShorts
              cardServing={cardServing}
              cardMinute={cardMinute}
              recipeTitle={recipe.recipeTitle}
              videoThumbnailUrl={recipe.videoInfo.videoThumbnailUrl}
              servings={recipe.detailMeta?.servings ?? 0}
              cookingTime={recipe.detailMeta?.cookingTime ?? 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function NormalRecipeListMobile<
  TRecipe extends RecipeCardsSectionRecipe
>({
  recipes,
  loadMoreRef,
  isFetchingNextPage,
  onRecipeClick,
  cardBadge,
  cardServing,
  cardMinute,
  observeRef,
}: {
  recipes: TRecipe[];
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isFetchingNextPage: boolean;
  onRecipeClick?: (recipe: TRecipe) => void;
  cardBadge: string;
  cardServing: (count: number) => string;
  cardMinute: (count: number) => string;
  observeRef?: (el: HTMLDivElement | null, recipeId: string, index: number) => void;
}) {
  const router = useRouter();

  return (
    <section className="space-y-6 w-full">
      {recipes.map((recipe, index) => (
        <div
          key={recipe.recipeId}
          ref={(el) => observeRef?.(el, recipe.recipeId, index)}
          className="w-full cursor-pointer"
          onClick={() => {
            onRecipeClick?.(recipe);
            navigateToRecipeDetail(router, {
              recipeId: recipe.recipeId,
              recipeTitle: recipe.recipeTitle,
              videoId: recipe.videoInfo.videoId,
              description: recipe.detailMeta?.description,
              servings: recipe.detailMeta?.servings,
              cookingTime: recipe.detailMeta?.cookingTime,
            });
          }}
        >
          <RecipeCardNormal
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
        </div>
      ))}

      {isFetchingNextPage && (
        <>
          <div className="w-full">
            <RecipeCardNormalSkeleton />
          </div>
          <div className="w-full">
            <RecipeCardNormalSkeleton />
          </div>
        </>
      )}

      <div ref={loadMoreRef} className="h-24" />
    </section>
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

function RecipeCardShorts({
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

export function RecipeCardNormal({
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

function RecipeCardNormalSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-white overflow-hidden border border-gray-100">
      <div className="relative w-full aspect-[16/9]">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none bg-gray-200" />
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <Skeleton className="h-5 w-14 rounded-full bg-gray-300/70" />
          <Skeleton className="h-5 w-14 rounded-full bg-gray-300/70" />
        </div>
      </div>
      <div className="p-2">
        <div className="pt-2 px-1 space-y-2">
          <Skeleton className="h-4 w-4/5 rounded bg-gray-200" />
          <Skeleton className="h-4 w-3/5 rounded bg-gray-200" />
        </div>
        <div className="mt-2 px-1 space-y-2">
          <Skeleton className="h-4 w-full rounded bg-gray-200" />
          <Skeleton className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
        <div className="mt-3 px-1 flex gap-2">
          <Skeleton className="h-4 w-14 rounded bg-gray-200" />
          <Skeleton className="h-4 w-14 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function RecipeCardShortsSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-gray-200/60 aspect-[9/16] relative">
      <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      <div className="absolute top-2 left-2 flex items-center gap-2">
        <Skeleton className="h-5 w-14 rounded-full bg-gray-300/70" />
        <Skeleton className="h-5 w-14 rounded-full bg-gray-300/70" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      <div className="absolute bottom-2 left-2 right-2 space-y-1">
        <Skeleton className="h-3.5 w-3/4 rounded bg-gray-300/70" />
        <Skeleton className="h-3.5 w-1/2 rounded bg-gray-300/70" />
      </div>
    </div>
  );
}

/** Shorts 수평 스크롤 리스트 스켈레톤 — 실제 shorts section과 동일한 레이아웃 */
export function ShortsHorizontalListSkeleton() {
  return (
    <section className="mb-6">
      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-[150px] shrink-0">
            <RecipeCardShortsSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}

/** Normal 수직 스크롤 리스트 스켈레톤 — 실제 normal section과 동일한 레이아웃 */
export function NormalVerticalListSkeleton() {
  return (
    <section className="space-y-6 w-full">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="w-full">
          <RecipeCardNormalSkeleton />
        </div>
      ))}
    </section>
  );
}
