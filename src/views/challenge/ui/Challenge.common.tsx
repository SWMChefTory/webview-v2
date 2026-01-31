import { useInfiniteScroll } from "@/src/shared/hooks";
import {
  ChallengeRecipeCard,
  ChallengeRecipeCardSkeleton,
  type ChallengeRecipe,
} from "@/src/features/challenge";

export type ChallengeVariant = "mobile" | "tablet" | "desktop";

interface LayoutConfig {
  gridCols: string;
  gap: string;
  padding: string;
  titleSize: string;
  subtitleSize: string;
  skeletonCount: number;
  cardWrapper?: string;
}

const LAYOUT_CONFIG: Record<ChallengeVariant, LayoutConfig> = {
  mobile: {
    gridCols: "grid-cols-2",
    gap: "gap-4",
    padding: "px-4 pb-6",
    titleSize: "text-lg",
    subtitleSize: "text-sm",
    skeletonCount: 2,
  },
  tablet: {
    gridCols: "grid-cols-3",
    gap: "gap-6",
    padding: "p-6",
    titleSize: "text-xl",
    subtitleSize: "text-base",
    skeletonCount: 3,
    cardWrapper: "active:scale-[0.98] transition-transform duration-200",
  },
  desktop: {
    gridCols: "grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
    gap: "gap-8",
    padding: "p-8",
    titleSize: "text-2xl",
    subtitleSize: "text-lg font-medium",
    skeletonCount: 5,
    cardWrapper: "hover:scale-[1.02] hover:shadow-lg transition-all duration-200 rounded-xl",
  },
};

export interface ChallengeRecipeListProps {
  recipes: ChallengeRecipe[];
  totalElements: number;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  variant: ChallengeVariant;
}

export function ChallengeRecipeList({
  recipes,
  totalElements,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  variant,
}: ChallengeRecipeListProps) {
  const config = LAYOUT_CONFIG[variant];
  const { loadMoreRef } = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  return (
    <div className={config.padding}>
      <div className={`flex items-baseline ${variant === "mobile" ? "gap-2 mb-4" : variant === "tablet" ? "gap-3 mb-6" : "gap-4 mb-8"}`}>
        <h2 className={`${config.titleSize} font-bold text-gray-900`}>챌린지 레시피</h2>
        <span className={`${config.subtitleSize} text-gray-500`}>총 {totalElements}개</span>
      </div>

      <div className={`grid ${config.gridCols} ${config.gap}`}>
        {recipes.map((recipe) => (
          config.cardWrapper ? (
            <div key={recipe.recipeId} className={config.cardWrapper}>
              <ChallengeRecipeCard recipe={recipe} />
            </div>
          ) : (
            <ChallengeRecipeCard key={recipe.recipeId} recipe={recipe} />
          )
        ))}
        {isFetchingNextPage && (
          <ChallengeRecipeListSkeleton count={config.skeletonCount} />
        )}
      </div>

      <div ref={loadMoreRef} className="h-20" />
    </div>
  );
}

function ChallengeRecipeListSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ChallengeRecipeCardSkeleton key={i} />
      ))}
    </>
  );
}
