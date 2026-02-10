import { Skeleton } from "@/components/ui/skeleton";
import { AlreadyEnrolledChip } from "@/src/shared/ui/chip/recipeCreatingStatusChip";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import type { RecommendRecipe } from "@/src/entities/recommend-recipe";

interface PopularRecipeCardProps {
  recipe: RecommendRecipe;
  isTablet?: boolean;
}

export function PopularRecipeCard({ recipe, isTablet = false }: PopularRecipeCardProps) {
  return (
    <div className={`relative aspect-[16/9] ${isTablet ? "hover:scale-[1.02] transition-transform duration-200" : ""}`}>
      <div className="absolute top-1 left-1 z-10">
        <AlreadyEnrolledChip isEnrolled={recipe.isViewed} />
      </div>
      <img
        src={recipe.videoInfo.videoThumbnailUrl}
        alt={recipe.recipeTitle}
        className={`w-full h-full object-cover ${isTablet ? "rounded-lg shadow-sm hover:shadow-md transition-shadow" : "rounded-md"}`}
      />
      <div className="h-1" />
      <div className="relative">
        <div className={`absolute top-0 left-0 font-medium line-clamp-2 w-full ${isTablet ? "text-sm" : "text-base"}`}>
          {recipe.recipeTitle}
        </div>
        <div className="flex flex-col">
          <div className={`invisible ${isTablet ? "text-xs" : "text-sm"}`}>temp text</div>
          <div className={`invisible ${isTablet ? "text-xs" : "text-sm"}`}>temp text</div>
        </div>
      </div>
      <div className={isTablet ? "h-4" : "h-6"} />
    </div>
  );
}

interface PopularRecipeCardSkeletonProps {
  isTablet?: boolean;
}

export function PopularRecipeCardSkeleton({ isTablet = false }: PopularRecipeCardSkeletonProps) {
  return (
    <div className="relative aspect-[16/9]">
      <Skeleton className={`w-full h-full ${isTablet ? "rounded-lg" : "rounded-md"}`} />
      <div className="h-1" />
      <div className="relative">
        <div className="flex flex-col w-full">
          <TextSkeleton fontSize={isTablet ? "text-sm" : "text-base"} />
          <TextSkeleton fontSize={isTablet ? "text-sm" : "text-base"} />
        </div>
      </div>
      <div className={isTablet ? "h-4" : "h-6"} />
    </div>
  );
}
