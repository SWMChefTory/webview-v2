import Header, { BackButton, HeaderSpacing } from "@/src/shared/ui/header";
import { useRouter } from "next/router";

import { ALL_RECIPES } from "@/src/entities/user_recipe/model/useUserRecipe";
import { CategoryListSection } from "@/src/pages/user-recipe/ui/categoryListSection";
import { RecipeListSection } from "@/src/pages/user-recipe/ui/recipeCardListSection";
import { useState } from "react";
import PageMovementTemplate from "@/src/shared/ui/page-movement/pageMovement";

export function UserRecipe() {
  const router = useRouter();

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | typeof ALL_RECIPES
  >(ALL_RECIPES);

  return (
    <PageMovementTemplate>
      <div className="flex flex-col overflow-hidden bg-stone-800 h-[100vh] w-[100vw]">
        <div className="fixed top-0 left-0 right-0 z-10">
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
        </div>
        <HeaderSpacing />
        <CategoryListSection
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        />
        <RecipeListSection selectedCategoryId={selectedCategoryId} />
      </div>
    </PageMovementTemplate>
  );
}
