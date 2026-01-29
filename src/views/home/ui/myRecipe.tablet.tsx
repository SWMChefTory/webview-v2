import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { type Category } from "@/src/entities/category/model/useCategory";
import {
  ALL_RECIPES,
  useFetchAllRecipes,
  useFetchCategoryRecipes,
} from "@/src/entities/user-recipe/model/useUserRecipe";
import { type UserRecipe } from "@/src/entities/user-recipe/model/schema";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import {
  UserRecipeCardEmpty,
  UserRecipeCardReady,
  UserRecipeCardSkeleton,
} from "@/src/views/home/ui/userRecipeCard";

import { useCallback, useState } from "react";

import {
  CategoryListReady,
  CategoryListSkeleton,
  MyRecipeTitleReady,
} from "./myRecipe.common";
import { HorizontalScrollArea } from "./horizontalScrollArea";

/**
 * MyRecipes 섹션 - 태블릿 버전 (768px ~)
 * - 카테고리: 가로 스크롤
 * - 레시피 목록: 가로 스크롤 + 더보기 링크
 */
export const MyRecipesTablet = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    Category | typeof ALL_RECIPES
  >(ALL_RECIPES);

  return (
    <MyRecipesTemplateTablet
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

const MyRecipesTemplateTablet = ({
  title,
  categoryList,
  userRecipesSection,
}: {
  title: React.ReactNode;
  categoryList: React.ReactNode;
  userRecipesSection: React.ReactNode;
}) => {
  return (
    <div className="pt-2">
      <div className="px-6 mb-4 flex items-center justify-between">{title}</div>

      <ScrollArea className="whitespace-nowrap pb-2">
        <div className="flex flex-row pl-6 pr-6 gap-3">{categoryList}</div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>

      <div className="h-6" />

      {userRecipesSection}
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
  const {
    entities: userRecipes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchAllRecipes();

  const handleReachEnd = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <UserRecipesSectionTemplate
      userRecipes={userRecipes}
      onReachEnd={handleReachEnd}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
};

const UserRecipesCategorySection = ({ category }: { category: Category }) => {
  const {
    entities: userRecipes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchCategoryRecipes({ id: category.id, name: category.name });

  const handleReachEnd = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <UserRecipesSectionTemplate
      userRecipes={userRecipes}
      onReachEnd={handleReachEnd}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
};

const UserRecipesSectionTemplate = ({
  userRecipes,
  onReachEnd,
  isFetchingNextPage,
}: {
  userRecipes: UserRecipe[];
  onReachEnd: () => void;
  isFetchingNextPage: boolean;
}) => {
  if (userRecipes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 px-6">
        <UserRecipeCardEmpty />
      </div>
    );
  }

  return (
    <HorizontalScrollArea
      moreLink="/user/recipes"
      gap="gap-5"
      onReachEnd={onReachEnd}
    >
      {userRecipes.map((recipe) => (
        <UserRecipeCardReady userRecipe={recipe} key={recipe.recipeId} isTablet={true} />
      ))}
      {isFetchingNextPage && <UserRecipeCardSkeleton isTablet={true} />}
    </HorizontalScrollArea>
  );
};

const UserRecipesSectionSkeleton = () => {
  return (
    <HorizontalScrollArea gap="gap-5">
      {Array.from({ length: 6 }, (_, index) => (
        <UserRecipeCardSkeleton key={index} isTablet={true} />
      ))}
    </HorizontalScrollArea>
  );
};
