import { ThumbnailSkeleton, ThumbnailReady } from "./thumbnail";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import {
  useFetchRecipesSearched,
  Recipe,
} from "@/src/entities/recipe-searched/useRecipeSearched";
import { FaRegClock } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";

export function SearchResultsSkelton() {
  return (
    <div className="flex flex-col px-[4] w-full h-[100vh]">
      <div className="px-[4] pt-[12] pb-[24] w-[60%]">
        <TextSkeleton fontSize="text-xl" />
      </div>
      <div className="grid grid-cols-2 w-full gap-y-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <RecipeSearchedCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function SearchResultsReady({ keyword }: { keyword: string }) {
  const { data: searchResults } = useFetchRecipesSearched({ query: keyword });
  if (searchResults.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="w-[100] h-[100] ">
          <img src={"./empty_state.png"} alt="empty-search block" />
        </div>
        <div className="h-[20]" />
        <div className="font-bold">검색어에 해당하는 레시피가 없어요</div>
        <div className="h-[300]" />
      </div>
    );
  }
  return (
    <div className="flex flex-col px-[4] w-full h-[100vh]">
      <div className="flex pt-[12] pb-[24] w-[100%] items-center justify-center">
        <div className="flex flex-row w-[96%]">
        <div className="text-xl truncate">
          <span className="font-bold">{keyword}</span>
        </div>
        <div className="text-xl shrink-0">에 대한 검색결과</div>
        </div>
      </div>
      <div className="grid grid-cols-2 w-full gap-y-4">
        {searchResults.map((recipe) => (
          <RecipeSearchedCardReady
            key={recipe.recipeId}
            searchResults={recipe}
          />
        ))}
      </div>
    </div>
  );
}

const RecipeSearchedCardReady = ({
  searchResults,
}: {
  searchResults: Recipe;
}) => {
  return (
    <div className="px-[4] w-full">
      <ThumbnailReady imgUrl={searchResults.videoInfo.videoThumbnailUrl} />
      <div className="text-lg truncate">{searchResults.recipeTitle}</div>
      <div className="flex flex-row gap-x-2">
        <div className="flex flex-row gap-x-1 items-center">
          <BsPeople size={16} />
          {searchResults.detailMeta?.servings}인분
        </div>
        <div className="flex flex-row gap-x-1 items-center">
          <FaRegClock size={16} />
          {searchResults.detailMeta?.cookingTime}분
        </div>
      </div>
      <div className="flex flex-row gap-x-2 overflow-x-scroll">
        {searchResults.tags?.map((tag) => (
          <div className="text-sm">#{tag.name}</div>
        ))}
      </div>
      <div className="text-sm line-clamp-2 min-h-[2.5rem]">
        {searchResults.detailMeta?.description}
      </div>
    </div>
  );
};

const RecipeSearchedCardFetchingNextPage = ({
  isFetchingNextPage,
}: {
  isFetchingNextPage: boolean;
}) => {
  return isFetchingNextPage ? (
    <>
      <RecipeSearchedCardSkeleton />
      <RecipeSearchedCardSkeleton />
    </>
  ) : null;
};

const RecipeSearchedCardSkeleton = () => {
  return (
    <div className="px-[4] w-full">
      <ThumbnailSkeleton />
      <TextSkeleton fontSize="text-lg " />
      <div className="flex flex-row gap-x-2">
        <TextSkeleton fontSize="text-sm" />
        <TextSkeleton fontSize="text-sm" />
      </div>
      <TextSkeleton fontSize="text-sm" />
      <TextSkeleton fontSize="text-sm" />
    </div>
  );
};
