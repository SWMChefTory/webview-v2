import { useRouter } from "next/router";
import { VideoType } from "@/src/entities/schema";

export type RecipeCardEntryPoint =
  | "popular_normal"
  | "popular_shorts"
  | "theme_chef"
  | "theme_trend"
  | "search_trend"
  | "search_result"
  | "category_recommend"
  | "category_cuisine";

type RecipeCardWrapperProps = {
  recipeId: string;
  recipeCreditCost: number;
  recipeTitle: string;
  recipeIsViewed: boolean;
  recipeVideoType: VideoType;
  recipeVideoUrl: string;
  trigger: React.ReactNode;
  entryPoint: RecipeCardEntryPoint;
  videoId: string;
  description?: string;
  servings?: number;
  cookingTime?: number;
  onTrackClick?: () => void;
};

//이 요소를 부모로 두면 자식 요소를 클릭하면 다이어로그가 열리도록 함.
export function RecipeCardWrapper({
  recipeId,
  recipeTitle,
  videoId,
  description,
  servings,
  cookingTime,
  trigger,
  onTrackClick,
}: RecipeCardWrapperProps) {
  const router = useRouter();

  const handleCardClick = () => {
    onTrackClick?.();
    router.push({
      pathname: `/recipe/${recipeId}/detail`,
      query: {
        title: recipeTitle,
        videoId,
        description,
        servings,
        cookingTime,
      },
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer"
    >
      {trigger}
    </div>
  );
}
