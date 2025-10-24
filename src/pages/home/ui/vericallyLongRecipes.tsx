import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Fire from "./assets/fire.png";
import {
  PopularRecipe,
  useFecthPopularRecipe,
} from "@/src/pages/home/entities/popular_recipe/model/usePopularRecipe";
import { VideoType } from "../entities/popular_recipe/type/videoType";
import { AlreadyEnrolledChip } from "./chips";

export function VerticallyLongRecipes() {
  const { data: recipes } = useFecthPopularRecipe();
  const shortsRecipes = recipes.filter(
    (recipe) => recipe.videoType === VideoType.SHORTS
  );
  return (
    <div>
      <div className="h-12" />
      <div className="pl-4 flex items-center gap-2">
        <div className="text-2xl font-semibold">쇼츠 인기 레시피</div>
        <img src={Fire.src} className="size-6" />
      </div>
      <div className="h-3" />
      <ScrollArea className="whitespace-nowrap w-[100vw]">
        <div className="pl-4 flex flex-row gap-2 whitespace-normal min-w-[100.5vw]">
          {shortsRecipes.map((recipe) => (
            <ShortsRecipeCard recipe={recipe} key={recipe.recipeId} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="opacity-0  z-10" />
      </ScrollArea>
    </div>
  );
}

function ShortsRecipeCard({ recipe }: { recipe: PopularRecipe }) {
  return (
    <div className="relative w-[180] h-[320] overflow-hidden rounded-md">
      <div className="absolute top-[12] left-[8]">
      <AlreadyEnrolledChip isEnrolled={recipe.isViewed} />
      </div>
      <img
        src={recipe.videoThumbnailUrl}
        className="block w-full h-full object-cover "
      />
      <div className="absolute bottom-[32] w-[160px] left-[10] font-bold text-white truncate">{recipe.recipeTitle}</div>
      <div className="absolute bottom-[10] left-[10] text-sm text-white">조회수 {recipe.count}회</div>
    </div>
  );  
}
