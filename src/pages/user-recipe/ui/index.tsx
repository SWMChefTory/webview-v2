import Header, { BackButton, } from "@/src/shared/ui/header";
import { useRouter } from "next/router";

import { ALL_RECIPES } from "@/src/entities/user_recipe/model/useUserRecipe";
import { CategoryListSection } from "@/src/pages/user-recipe/ui/categoryListSection";
import {
  RecipeListSectionReady,
  RecipeListSectionSkeleton,
} from "@/src/pages/user-recipe/ui/recipeCardListSection";
import { useState } from "react";
import PageMovementTemplate from "@/src/shared/ui/page-movement/pageMovement";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";

export function UserRecipe() {
  const router = useRouter();

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | typeof ALL_RECIPES
  >(ALL_RECIPES);

  console.log("selectedCategoryId", selectedCategoryId);

  return (
    <PageMovementTemplate>
      <div className="flex flex-col overflow-hidden bg-stone-800 h-[100vh] w-[100vw]">
        <Header
          leftContent={
            <BackButton
              onClick={() => {
                router.back();
              }}
              color="text-white"
            />
          }
        />
        <CategoryListSection
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        />
        <SSRSuspense fallback={<RecipeListSectionSkeleton />}>
          <RecipeListSectionReady selectedCategoryId={selectedCategoryId} />
        </SSRSuspense>
      </div>
    </PageMovementTemplate>
  );
}
