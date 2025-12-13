import Header, { BackButton } from "@/src/shared/ui/header/header";
import { useRouter } from "next/router";

import { ALL_RECIPES } from "@/src/entities/user_recipe/model/useUserRecipe";
import { CategoryListSection } from "@/src/views/user-recipe/ui/categoryListSection";
import {
  RecipeListSectionReady,
  RecipeListSectionSkeleton,
} from "@/src/views/user-recipe/ui/recipeCardListSection";
import { useState } from "react";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";

export function UserRecipe() {
  const router = useRouter();
  useSafeArea({
    top: { color: "#FFFFFF", isExists: true },
    bottom: { color: "#FFFFFF", isExists: true },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: false },
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | typeof ALL_RECIPES
  >(ALL_RECIPES);

  return (
    <div className="flex flex-col overflow-hidden h-[100vh] w-[100vw] select-none bg-white">
      <Header
        leftContent={
          <BackButton
            onClick={() => {
            router.back();
            }}
          />
        }
      />
      <div className="pl-5 text-2xl font-bold pb-2">나의 레시피</div>
      <CategoryListSection
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
      />
      <SSRSuspense fallback={<RecipeListSectionSkeleton />}>
        <RecipeListSectionReady selectedCategoryId={selectedCategoryId} />
      </SSRSuspense>
    </div>
  );
}
