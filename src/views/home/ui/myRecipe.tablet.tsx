import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  UserRecipeCardEmpty,
  UserRecipeCardSkeleton,
} from "@/src/views/home/ui/userRecipeCard";
import { Category } from "@/src/entities/category/model/useCategory";
import { useState, useEffect, useRef } from "react";
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

/**
 * MyRecipes 섹션 - 태블릿 버전 (768px ~)
 *
 * 특징:
 * - 카테고리: 가로 스크롤 (동일)
 * - 레시피 목록: Grid 3열
 * - 무한 스크롤: IntersectionObserver
 * - 좌우 패딩: px-6
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
 * 좌우 패딩 추가 (px-6)
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
    <div className="pt-2 px-6">
      {title}
      <div className="h-2" />
      {/* 카테고리 필터 - 가로 스크롤 (동일) */}
      <ScrollArea className="whitespace-nowrap">
        <div className="flex flex-row">{categoryList}</div>
        <ScrollBar orientation="horizontal" className="opacity-0 z-10" />
      </ScrollArea>
      <div className="h-4" />
      {/* 레시피 목록 - Grid 3열 */}
      {userRecipesSection}
    </div>
  );
};

/**
 * 사용자 레시피 목록 섹션 (태블릿)
 * Grid 3열 + IntersectionObserver 무한 스크롤
 */
const UserRecipesSection = ({
  selectedCategory,
}: {
  selectedCategory: Category | typeof ALL_RECIPES;
}) => {
  const {
    recipes: userRecipes,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useFetchUserRecipes(selectedCategory);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver로 무한 스크롤
  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  // 빈 상태
  if (userRecipes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <UserRecipeCardEmpty />
      </div>
    );
  }

  // 레시피 목록 (Grid 3열, 데스크탑 4열)
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
        {userRecipes.map((recipe) => (
          <UserRecipeCardReady userRecipe={recipe} key={recipe.recipeId} isTablet={true} />
        ))}
        {isFetchingNextPage && (
          <>
            <UserRecipeCardSkeleton isTablet={true} />
            <UserRecipeCardSkeleton isTablet={true} />
            <UserRecipeCardSkeleton isTablet={true} />
          </>
        )}
      </div>
      {/* IntersectionObserver 타겟 */}
      {hasNextPage && !isFetchingNextPage && (
        <div ref={loadMoreRef} className="h-20" />
      )}
    </div>
  );
};

/**
 * 로딩 Skeleton (태블릿)
 * Grid 3열, 데스크탑 4열
 */
const UserRecipesSectionSkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-4 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
      {Array.from({ length: 6 }, (_, index) => (
        <UserRecipeCardSkeleton key={index} isTablet={true} />
      ))}
    </div>
  );
};
