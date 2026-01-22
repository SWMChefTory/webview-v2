import Header, { BackButton } from "@/src/shared/ui/header/header";
import { useRouter } from "next/router";
import { ALL_RECIPES } from "@/src/entities/user-recipe/model/useUserRecipe";
import { CategoryListSection } from "@/src/views/user-recipe/ui/categoryListSection";
import {
  RecipeListSectionReady,
  RecipeListSectionSkeleton,
} from "@/src/views/user-recipe/ui/recipeCardListSection";
import { useState } from "react";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";
import { useUserRecipeTranslation } from "../hooks/useUserRecipeTranslation";

export function UserRecipeTablet() {
  const router = useRouter();
  const { t } = useUserRecipeTranslation();

  useSafeArea({
    top: { color: "#FFFFFF", isExists: true },
    bottom: { color: "#FFFFFF", isExists: true },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: true },
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | typeof ALL_RECIPES
  >(ALL_RECIPES);

  return (
    <div className="flex flex-col min-h-screen w-full select-none bg-white">
      <Header
        leftContent={
          <BackButton
            onClick={() => {
              router.back();
            }}
          />
        }
      />
      <div className="w-full max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto pb-8">
        <div className="px-6 text-2xl lg:text-3xl xl:text-4xl font-bold pb-3">{t("title")}</div>
        <CategoryListSection
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          isTablet
        />
        <SSRSuspense fallback={<RecipeListSectionSkeleton isTablet />}>
          <RecipeListSectionReady selectedCategoryId={selectedCategoryId} isTablet />
        </SSRSuspense>
      </div>
    </div>
  );
}
