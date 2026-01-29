import { VideoType } from "@/src/entities/recommend-recipe/type/videoType";
import { useFetchRecommendRecipes } from "@/src/entities/recommend-recipe/model/useRecommendRecipe";
import { RecommendType } from "@/src/entities/recommend-recipe/type/recommendType";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { Skeleton } from "@/components/ui/skeleton";
import { AlreadyEnrolledChip } from "@/src/shared/ui/chip/recipeCreatingStatusChip";
import { RecipeCardWrapper } from "@/src/widgets/recipe-creating-modal/recipeCardWrapper";
import { RecipeCreateToast } from "@/src/entities/user-recipe/ui/toast";
import { Viewport } from "@radix-ui/react-toast";
import { useTranslation } from "next-i18next";
// import { PopularSummaryRecipeDto } from "@/src/entities/popular-recipe/api/api";

function PopularRecipeContent() {
  const { t } = useTranslation("popular-recipe");
  return (
    <div className="px-4 md:px-6">
      <div className="h-4" />
      <div className="text-2xl font-semibold">{t("popularRecipes")}</div>
      <div className="h-4" />
      <SSRSuspense fallback={<PopularRecipesSkeleton />}>
        <PopularRecipesReady />
      </SSRSuspense>
    </div>
  );
}

function PopularRecipesReady() {
  const {
    entities: recipes,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useFetchRecommendRecipes({
    videoType: VideoType.NORMAL,
    recommendType: RecommendType.POPULAR,
  });
  return (
    <div
      className="overflow-y-scroll h-[100vh] no-scrollbar"
      onScroll={(event: any) => {
        if (
          event.target.scrollTop + event.target.clientHeight >=
          event.target.scrollHeight + 10
        ) {
          if (hasNextPage) {
            fetchNextPage();
          }
        }
      }}
    >
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4 min-h-[100.5vh]">
        {recipes.map((recipe) => (
          <RecipeCardWrapper
            key={recipe.recipeId}
            recipeId={recipe.recipeId}
            recipeCreditCost={recipe.creditCost}
            recipeTitle={recipe.recipeTitle}
            recipeIsViewed={recipe.isViewed}
            recipeVideoType={VideoType.NORMAL}
            recipeVideoUrl={`https://www.youtube.com/watch?v=${recipe.videoInfo.videoId}`}
            entryPoint="popular_normal"
            trigger={
              <PopularRecipeCard
                recipe={{
                  recipeTitle: recipe.videoInfo.videoTitle,
                  videoThumbnailUrl: recipe.videoInfo.videoThumbnailUrl,
                  isViewed:recipe.isViewed,
                }}
              />
            }
          />
        ))}
        {isFetchingNextPage && <PopularRecipesSkeleton />}
      </div>
      <RecipeCreateToast>
        <Viewport className="fixed right-3 md:right-6 top-2 z-1000 w-[300px] md:w-[360px]" />
      </RecipeCreateToast>
    </div>
  );
}

function PopularRecipesSkeleton() {
  return (
    <div className="overflow-y-scroll h-[100vh] no-scrollbar">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4 min-h-[100.5vh]">
        {Array.from({ length: 10 }).map((_, index) => (
          <PopularRecipeCard key={index} />
        ))}
      </div>
    </div>
  );
}

type PopularRecipeCardProps = {
  recipe?: {
    recipeTitle: string;
    videoThumbnailUrl: string;
    isViewed: boolean;
  };
};

function PopularRecipeCard({ recipe }: PopularRecipeCardProps) {
  return (
    <div className="relative aspect-[16/9]">
      {recipe ? (
        <>
          <div className="absolute top-1 left-1">
            <AlreadyEnrolledChip isEnrolled={recipe.isViewed} />
          </div>
          <img
            src={recipe.videoThumbnailUrl}
            alt="popular-recipe"
            className="w-full h-full object-cover rounded-md"
          />
        </>
      ) : (
        <Skeleton className="w-full h-full rounded-md" />
      )}

      <div className="h-1" />

      <div className="relative">
        <div className="absolute top-0 left-0 font-medium line-clamp-2 w-full">
          {recipe ? (
            recipe.recipeTitle
          ) : (
            <div className="flex flex-col w-full">
              <TextSkeleton />
              <TextSkeleton />
            </div>
          )}
        </div>

        {/* 높이 유지용 */}
        <div className="flex flex-col">
          <div className="text-sm invisible">temp text</div>
          <div className="text-sm invisible">temp text</div>
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
}

export default PopularRecipeContent;
