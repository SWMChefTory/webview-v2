import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  UserRecipeCardEmpty,
  UserRecipeCardSkeleton,
} from "@/src/views/home/ui/userRecipeCard";
import { Category } from "@/src/entities/category/model/useCategory";
import { useState } from "react";
import {
  ALL_RECIPES,
  useFetchUserRecipes,
} from "@/src/entities/user-recipe/model/useUserRecipe";
import { UserRecipeCardReady } from "@/src/views/home/ui/userRecipeCard";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import {
  MyRecipeTitleReady,
  CategoryListSkeleton,
  CategoryListReady,
} from "./myRecipe.common";
import { HorizontalScrollArea } from "./horizontalScrollArea";

/**
 * MyRecipes 섹션 - 태블릿 버전 (768px ~)
 *
 * 특징:
 * - 카테고리: 가로 스크롤
 * - 레시피 목록: 가로 스크롤 + 더보기 링크
 * - 더보기: /user/recipes 페이지로 이동
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

/**
 * 태블릿 레이아웃 템플릿
 */
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
      <div className="px-6 mb-4 flex items-center justify-between">
        {title}
      </div>
      
      {/* 카테고리 필터 - 가로 스크롤 */}
      <ScrollArea className="whitespace-nowrap pb-2">
        <div className="flex flex-row pl-6 pr-6 gap-3">{categoryList}</div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
      
      <div className="h-6" />
      
      {/* 레시피 목록 - 가로 스크롤 */}
      {userRecipesSection}
    </div>
  );
};

/**
 * 사용자 레시피 목록 섹션 (태블릿)
 * 가로 스크롤 + 더보기 링크
 */
const UserRecipesSection = ({
  selectedCategory,
}: {
  selectedCategory: Category | typeof ALL_RECIPES;
}) => {
  const { recipes: userRecipes } = useFetchUserRecipes(selectedCategory);

  // 빈 상태
  if (userRecipes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 px-6">
        <UserRecipeCardEmpty />
      </div>
    );
  }

  return (
    <HorizontalScrollArea moreLink="/user/recipes" gap="gap-5">
      {userRecipes.map((recipe) => (
        <UserRecipeCardReady
          userRecipe={recipe}
          key={recipe.recipeId}
          isTablet={true}
        />
      ))}
    </HorizontalScrollArea>
  );
};

/**
 * 로딩 Skeleton (태블릿)
 */
const UserRecipesSectionSkeleton = () => {
  return (
    <HorizontalScrollArea gap="gap-5">
      {Array.from({ length: 6 }, (_, index) => (
        <UserRecipeCardSkeleton key={index} isTablet={true} />
      ))}
    </HorizontalScrollArea>
  );
};
