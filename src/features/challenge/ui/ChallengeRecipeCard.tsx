import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { FaRegClock } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import type { ChallengeRecipe } from "../model/schema";

interface ChallengeRecipeCardProps {
  recipe: ChallengeRecipe;
}

export function ChallengeRecipeCard({ recipe }: ChallengeRecipeCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/recipe/${recipe.recipeId}/detail`);
  };

  return (
    <article className="w-full cursor-pointer" onClick={handleClick}>
      {/* 썸네일 (고정 높이) */}
      <div className="h-[160px] w-full overflow-hidden rounded-lg">
        <img
          src={recipe.videoThumbnailUrl}
          alt={recipe.recipeTitle}
          className="block w-full h-full object-cover object-center"
        />
      </div>

      <div className="mt-3 space-y-2">
        {/* 제목 */}
        <h3 className="text-base font-bold text-gray-900 truncate">
          {recipe.recipeTitle}
        </h3>

        {/* 인분 / 시간 */}
        {(recipe.servings || recipe.cookingTime) && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <BsPeople size={14} className="shrink-0" />
                <span>{recipe.servings}인분</span>
              </div>
            )}
            {recipe.cookingTime && (
              <div className="flex items-center gap-1">
                <FaRegClock size={14} className="shrink-0" />
                <span>{recipe.cookingTime}분</span>
              </div>
            )}
          </div>
        )}

        {/* 태그 */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs text-orange-600 whitespace-nowrap"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function ChallengeRecipeCardSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="h-[160px] w-full rounded-lg" />
      <div className="mt-3 space-y-2">
        <TextSkeleton fontSize="text-base" />
        <div className="flex gap-3">
          <TextSkeleton fontSize="text-sm" />
          <TextSkeleton fontSize="text-sm" />
        </div>
      </div>
    </div>
  );
}
