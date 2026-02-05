import {
  UserRecipeCardEmpty,
  UserRecipeCardSkeleton,
} from "@/src/views/home/ui/userRecipeCard";
import { Category } from "@/src/entities/category/model/useCategory";
import { useState } from "react";
import {
  ALL_RECIPES,
  useFetchAllRecipes,
  useFetchCategoryRecipes,
} from "@/src/entities/user-recipe/model/useUserRecipe";
import type { UserRecipe } from "@/src/entities/user-recipe/model/api/schema";
import { UserRecipeCardReady } from "@/src/views/home/ui/userRecipeCard";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { ViewMoreCard } from "@/src/shared/ui/card";
import {
  MyRecipeTitleReady,
  CategoryListSkeleton,
  CategoryListReady,
} from "./myRecipe.common";

export const MyRecipesDesktop = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    Category | typeof ALL_RECIPES
  >(ALL_RECIPES);

  return (
    <MyRecipesTemplateDesktop
      title={<MyRecipeTitleReady />}
      categoryList={
        <SSRSuspense fallback={<CategoryListSkeleton />}>
          <CategoryListReady
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </SSRSuspense>
      }
      userRecipesSection={
        <SSRSuspense fallback={<UserRecipesSectionSkeleton />}>
          <UserRecipesSection selectedCategory={selectedCategory} />
        </SSRSuspense>
      }
    />
  );
};

const MyRecipesTemplateDesktop = ({
  title,
  categoryList,
  userRecipesSection,
}: {
  title: React.ReactNode;
  categoryList: React.ReactNode;
  userRecipesSection: React.ReactNode;
}) => {
  return (
    <div className="pt-4">
      <div className="px-8">{title}</div>
      <div className="h-3" />
      <div className="flex flex-wrap gap-3 px-8">
        {categoryList}
      </div>
      <div className="h-6" />
      <div className="px-8">{userRecipesSection}</div>
    </div>
  );
};

const UserRecipesSection = ({
  selectedCategory,
}: {
  selectedCategory: Category | typeof ALL_RECIPES;
}) => {
  if (selectedCategory === ALL_RECIPES) {
    return <UserRecipesAllSection />;
  }

  return <UserRecipesCategorySection category={selectedCategory} />;
};

const UserRecipesAllSection = () => {
  const { entities: userRecipes } = useFetchAllRecipes();
  return <UserRecipesGrid userRecipes={userRecipes} />;
};

const UserRecipesCategorySection = ({ category }: { category: Category }) => {
  const { entities: userRecipes } = useFetchCategoryRecipes({
    id: category.id,
    name: category.name,
  });
  return <UserRecipesGrid userRecipes={userRecipes} />;
};

const UserRecipesGrid = ({
  userRecipes,
}: {
  userRecipes: UserRecipe[];
}) => {
  if (userRecipes.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <UserRecipeCardEmpty />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {userRecipes.slice(0, 5).map((recipe) => (
        <UserRecipeCardReady userRecipe={recipe} key={recipe.recipeId} isTablet={true} />
      ))}
      <ViewMoreCard href="/user/recipes" />
    </div>
  );
};

const UserRecipesSectionSkeleton = () => {
  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {Array.from({ length: 5 }, (_, index) => (
        <UserRecipeCardSkeleton key={index} isTablet={true} />
      ))}
    </div>
  );
};
