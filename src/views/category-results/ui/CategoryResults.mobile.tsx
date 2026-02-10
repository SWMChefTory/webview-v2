import { useCategoryResultsController } from "./CategoryResults.controller";
import { EmptyState } from "./CategoryResults.common";
import { ShortsRecipeListMobile, NormalRecipeListMobile, ShortsHorizontalListSkeleton, NormalVerticalListSkeleton } from "@/src/widgets/recipe-cards-section";
import { VideoType } from "@/src/entities/schema";

export function CategoryResultsSkeletonMobile() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="px-2 pb-6 pt-4">
        <ShortsHorizontalListSkeleton />
        <NormalVerticalListSkeleton />
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
    getEntryPoint,
    getVideoUrl,
  } = useCategoryResultsController(categoryType, "mobile", videoType);

  if (recipes.length === 0) {
    return <EmptyState t={t} />;
  }

  const shortsRecipes = recipes.filter(
    (r) => r.videoInfo.videoType === "SHORTS"
  );
  const normalRecipes = recipes.filter(
    (r) => r.videoInfo.videoType === "NORMAL"
  );

  const entryPoint = getEntryPoint();
  const getVideoType = (recipe: (typeof recipes)[number]) =>
    recipe.videoInfo.videoType === "SHORTS" ? VideoType.SHORTS : VideoType.NORMAL;
  const cardServing = (count: number) => t("card.serving", { count });
  const cardMinute = (count: number) => t("card.minute", { count });

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="px-2 pb-28 pt-4">
        <ShortsRecipeListMobile
          recipes={shortsRecipes}
          entryPoint={entryPoint}
          getVideoType={getVideoType}
          getVideoUrl={getVideoUrl}
          cardServing={cardServing}
          cardMinute={cardMinute}
        />
        <NormalRecipeListMobile
          recipes={normalRecipes}
          loadMoreRef={loadMoreRef}
          isFetchingNextPage={isFetchingNextPage}
          entryPoint={entryPoint}
          getVideoType={getVideoType}
          getVideoUrl={getVideoUrl}
          cardBadge={t("card.badge")}
          cardServing={cardServing}
          cardMinute={cardMinute}
        />
      </div>
    </div>
  );
}
