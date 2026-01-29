import { useState } from "react";
import { useRouter } from "next/router";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";
import { useUserRecipeTranslation } from "../hooks/useUserRecipeTranslation";
import { ALL_RECIPES } from "@/src/entities/user-recipe/model/useUserRecipe";
import { CategoryListSection } from "@/src/views/user-recipe/ui/categoryListSection";
import {
  RecipeListSectionReady,
  RecipeListSectionSkeleton,
} from "@/src/views/user-recipe/ui/recipeCardListSection";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";

export type UserRecipeVariant = "mobile" | "tablet" | "desktop";

export interface UserRecipePageProps {
  title: string;
  onBack: () => void;
  categorySection: React.ReactNode;
  recipeListSection: React.ReactNode;
}

export function useUserRecipePageController(
  variant: UserRecipeVariant
): UserRecipePageProps {
  const router = useRouter();
  const { t } = useUserRecipeTranslation();

  const safeAreaRight = variant !== "mobile";
  
  useSafeArea({
    top: { color: "#FFFFFF", isExists: true },
    bottom: { color: "#FFFFFF", isExists: true },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: safeAreaRight },
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | typeof ALL_RECIPES
  >(ALL_RECIPES);

  const isTablet = variant === "tablet";
  const isDesktop = variant === "desktop";

  return {
    title: t("title"),
    onBack: () => router.back(),
    categorySection: (
      <CategoryListSection
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        isTablet={isTablet || isDesktop}
      />
    ),
    recipeListSection: (
      <SSRSuspense
        fallback={
          <RecipeListSectionSkeleton
            isTablet={isTablet}
            isDesktop={isDesktop}
          />
        }
      >
        <RecipeListSectionReady
          selectedCategoryId={selectedCategoryId}
          isTablet={isTablet}
          isDesktop={isDesktop}
        />
      </SSRSuspense>
    ),
  };
}
