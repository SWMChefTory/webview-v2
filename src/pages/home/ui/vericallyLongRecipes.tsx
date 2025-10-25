import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Fire from "./assets/fire.png";
import {
  PopularRecipe,
  sortByViewed,
  useFecthPopularRecipe,
} from "@/src/entities/popular_recipe/model/usePopularRecipe";
import { VideoType } from "../../../entities/popular_recipe/type/videoType";
import { AlreadyEnrolledChip } from "./chips";
import { useCreateRecipe } from "@/src/entities/user_recipe/model/useUserRecipe";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PopularRecipeCardWrapper } from "./popularRecipeCardDialog";

export function VerticallyLongRecipes() {
  const { data: recipes } = useFecthPopularRecipe();
  const shortsRecipes = recipes.filter(
    (recipe) => recipe.videoType === VideoType.SHORTS
  );
  const sortedRecipes = sortByViewed(shortsRecipes);
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
          {sortedRecipes.map((recipe) => (
            <PopularRecipeCardWrapper
              recipe={recipe}
              key={recipe.recipeId}
              trigger={<ShortsRecipeCardContent recipe={recipe} />}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="opacity-0  z-10" />
      </ScrollArea>
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


