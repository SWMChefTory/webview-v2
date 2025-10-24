import {
  fetchPopularSummary,
  PopularSummaryRecipeResponse,
  PopularSummaryRecipe,
} from "@/src/pages/home/entities/popular_recipe/api/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { VideoType } from "../type/videoType";


export class PopularRecipe {
  recipeId!: string;
  recipeTitle!: string;
  videoThumbnailUrl!: string;
  videoId!: string;
  videoUrl!: string;
  count!: number;
  isViewed!: boolean;
  videoType!: VideoType;
  
  constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }

  static fromApiResponse(data: PopularSummaryRecipe): PopularRecipe {
    return new PopularRecipe(data);
  }
}

export function useFecthPopularRecipe() {
  return useSuspenseQuery({
    queryKey: ["popularRecipe"],
    queryFn: fetchPopularSummary,
    select: (data) =>
      data.recommendRecipes.map((recipe) =>
        PopularRecipe.fromApiResponse(recipe)
      ),
  });
}
