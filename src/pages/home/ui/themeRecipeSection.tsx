import { Skeleton } from "@/components/ui/skeleton";
import Chef from "@/src/pages/home/ui/assets/chef.png";
import Trend from "@/src/pages/home/ui/assets/trend.png";
import {
  useFetchChefRecommendRecipes,
  useFetchTrendingRecipes,
} from "@/src/pages/home/entities/theme-recipe/useThemeRecipe";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { PopularRecipeCardWrapper } from "./popularRecipeCardDialog";

function ThemeRecipeSection() {
  return (
    <>
      <div className="h-6" />
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-t from-60% from-white to-orange-300 z-[-1]" />
        <ChefRecommendRecipeList />
        <TrendingRecipeList />
      </div>
    </>
  );
}

function ChefRecommendRecipeList() {
  return (
    <ThemeRecipeListTemplate
      title={
        <>
          <div className="pr-1 text-xl font-semibold"> 셰프들의 레시피</div>
          <div className="pr-1" />
          <img src={Chef.src} className="size-5" />
        </>
      }
      description="다른 셰프님들의 레시피도 확인해볼까요?"
      children={
        <SSRSuspense fallback={<ThemeRecipeCardSectionSkeleton />}>
          <ChefRecommendRecipeCardSectionReady />
        </SSRSuspense>
      }
    />
  );
}

{
  /* <PopularRecipeCardWrapper
  recipe={recipe}
  key={recipe.recipeId}
  trigger={<ShortsRecipeCardContent recipe={recipe} />}
/>; */
}

function TrendingRecipeList() {
  return (
    <ThemeRecipeListTemplate
      title={
        <>
          <div className="pr-1 text-xl font-semibold">트렌드 레시피</div>
          <div className="pr-1" />
          <img src={Trend.src} className="size-5" />
        </>
      }
      description="최근 인기 레시피를 모아봤어요"
      children={
        <SSRSuspense fallback={<ThemeRecipeCardSectionSkeleton />}>
          <TrendRecipeCardSectionReady />
        </SSRSuspense>
      }
    />
  );
}

function ThemeRecipeListTemplate({
  title,
  description,
  children,
}: {
  title: React.ReactNode;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="h-4" />
      <div className="flex flex-col pl-4">
        <div className="flex flex-row items-center">{title}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
      <div className="h-3" />
      <div className="flex flex-row gap-2 overflow-x-scroll">
        <div className="flex flex-row gap-2 pl-4">{children}</div>
      </div>
    </div>
  );
}

function ChefRecommendRecipeCardSectionReady() {
  const { data } = useFetchChefRecommendRecipes();

  return (
    <>
      {data.data.map((recipe) => (
        <PopularRecipeCardWrapper
          recipe={recipe}
          key={recipe.recipeId}
          trigger={
            <div key={recipe.recipeId}>
              <ThumbnailReady
                imgUrl={recipe.videoThumbnailUrl}
                isViewed={recipe.isViewed}
              />
              <div className="text-sm font-semibold line-clamp-2">
                {recipe.recipeTitle}
              </div>
            </div>
          }
        />
      ))}
    </>
  );
}

export function TrendRecipeCardSectionReady() {
  const { data } = useFetchTrendingRecipes();
  return (
    <>
      {data.data.map((recipe, index) => (
        <PopularRecipeCardWrapper
          recipe={recipe}
          key={recipe.recipeId}
          trigger={
            <div key={recipe.recipeId}>
              <ThumbnailReady
                imgUrl={recipe.videoThumbnailUrl}
                isViewed={recipe.isViewed}
              />
              <div className="text-sm font-semibold line-clamp-2">
                {recipe.recipeTitle}
              </div>
            </div>
          }
        />
      ))}
    </>
  );
}

export function ThemeRecipeCardSectionSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <ThumbnailSkeleton key={index} />
      ))}
    </>
  );
}

const ThumbnailReady = ({
  imgUrl,
  isViewed,
}: {
  imgUrl: string;
  isViewed: boolean;
}) => {
  return (
    <ThumbnailTemplate>
      {isViewed ? (
        <div className="absolute bg-stone-600/50 top-2 left-1 px-[4] py-[2] rounded-full text-xs">
          이미 등록했어요
        </div>
      ) : null}
      <img
        src={imgUrl}
        className="block w-full h-full object-cover object-center"
      />
    </ThumbnailTemplate>
  );
};

const ThumbnailSkeleton = () => {
  return (
    <ThumbnailTemplate>
      <Skeleton className="w-full h-full bg-gray-200" />
    </ThumbnailTemplate>
  );
};

const ThumbnailTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-[156] h-[120] flex-shrink-0 overflow-hidden rounded-md relative">
      {children}
    </div>
  );
};

export default ThemeRecipeSection;
