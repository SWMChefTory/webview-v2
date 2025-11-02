import Fire from "./assets/fire.png";
import {
  PopularRecipe,
  useFecthPopularRecipe,
} from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { AlreadyEnrolledChip } from "../../../shared/ui/chip/chip";
import { RecipeCardWrapper } from "../../../widgets/recipe-create-dialog/recipeCardWrapper";
import { HorizontalScrollArea } from "./horizontalScrollArea";

export function PopularShortsRecipes() {
  const {
    data: recipes,
    fetchNextPage,
    hasNextPage,
  } = useFecthPopularRecipe(VideoType.SHORTS);

  return (
    <div>
      <div className="h-12" />
      <div className="pl-4 flex items-center gap-2">
        <div className="text-2xl font-semibold">쇼츠 인기 레시피</div>
        <img src={Fire.src} className="size-6" />
      </div>
      <div className="h-3" />
      <HorizontalScrollArea
        onReachEnd={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
      >
        <div className=" flex flex-row gap-2 whitespace-normal min-w-[100.5vw]">
          {recipes.map((recipe) => (
            <RecipeCardWrapper
              recipe={recipe}
              key={recipe.recipeId}
              trigger={<ShortsRecipeCardContent recipe={recipe} />}
            />
          ))}
        </div>
      </HorizontalScrollArea>
    </div>
  );
}

function ShortsRecipeCardContent({ recipe }: { recipe: PopularRecipe }) {
  return (
    <div className="relative w-[180] h-[320] overflow-hidden rounded-md ">
      <div className="absolute top-[12] left-[8]">
        <AlreadyEnrolledChip isEnrolled={recipe.isViewed} />
      </div>
      <img
        src={recipe.videoThumbnailUrl}
        className="block w-full h-full object-cover "
      />
      <div className="absolute text-left bottom-[24] w-[160px] left-[10] font-bold text-white line-clamp-2">
        {recipe.recipeTitle}
      </div>
    </div>
  );
}
