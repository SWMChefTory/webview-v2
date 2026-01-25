import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  UserRecipeCardEmpty,
  UserRecipeCardSkeleton,
} from "@/src/views/home/ui/userRecipeCard";
import { Category } from "@/src/entities/category/model/useCategory";
import { useState } from "react";
import {
  ALL_RECIPES,
  useFetchAllRecipes,
} from "@/src/entities/user-recipe/model/useUserRecipe";
import { UserRecipeCardReady } from "@/src/views/home/ui/userRecipeCard";
import { HorizontalScrollArea } from "./horizontalScrollArea";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import {
  MyRecipeTitleReady,
  CategoryListSkeleton,
  CategoryListReady,
} from "./myRecipe.common";
import { useFetchRecommendRecipes } from "@/src/entities/recommend-recipe/model/useRecommendRecipe";
import { VideoType } from "@/src/entities/recommend-recipe/type/videoType";
import { RecommendType } from "@/src/entities/recommend-recipe/type/recommendType";

/**
 * MyRecipes 섹션 - 모바일 버전 (0 ~ 767px)
 *
 * 특징:
 * - 카테고리: 가로 스크롤
 * - 레시피 목록: HorizontalScrollArea (가로 스크롤)
 * - 무한 스크롤: onReachEnd 이벤트
 */
export const MyRecipesMobile = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    Category | typeof ALL_RECIPES
  >(ALL_RECIPES);

  return (
    <MyRecipesTemplateMobile
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
          <UserRecipesSection />
        </SSRSuspense>
      }
    />
    // <SSRSuspense fallback={<UserRecipesSectionSkeleton />}>
    //       <UserRecipesSection selectedCategory={selectedCategory} />
    //     </SSRSuspense>
      //   <SSRSuspense fallback={<UserRecipesSectionSkeleton />}>
      //   <UserRecipesSection />
      // </SSRSuspense>
  );
};



/**
 * 모바일 레이아웃 템플릿
 */
const MyRecipesTemplateMobile = ({
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
      {title}
      <div className="h-2" />
      {/* 카테고리 필터 - 가로 스크롤 */}
      <ScrollArea className="whitespace-nowrap w-[100vw]">
        <div className="flex flex-row pl-4 min-w-[100.5vw]">{categoryList}</div>
        <ScrollBar orientation="horizontal" className="opacity-0 z-10" />
      </ScrollArea>
      <div className="h-3" />
      {/* 레시피 목록 - 가로 스크롤 */}
      {userRecipesSection}
    </div>
  );
};


const UserRecipesSection = () => {
  const {
    entities: userRecipes,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useFetchAllRecipes();
  // const {
  //   entities: recipes,
  //   isFetchingNextPage,
  //   hasNextPage,
  //   fetchNextPage,
  // } = useFetchRecommendRecipes({
  //   videoType: VideoType.NORMAL,
  //   recommendType: RecommendType.POPULAR,
  // });

  // if (userRecipes.length === 0) {
  //   return (
  //     <HorizontalScrollArea>
  //       <UserRecipeCardEmpty />
  //     </HorizontalScrollArea>
  //   );
  // }

  // 레시피 목록 (가로 스크롤)
  return (
    <HorizontalScrollArea
      onReachEnd={() => {
        if (hasNextPage&&!isFetchingNextPage) {
          fetchNextPage();
        }
      }}
    >
      {userRecipes.map((recipe) => (
        <UserRecipeCardReady userRecipe={recipe} key={recipe.recipeId} />
      ))}
      {isFetchingNextPage && <UserRecipeCardSkeleton />}
    </HorizontalScrollArea>
  );
};

/**
 * 로딩 Skeleton
 */
const UserRecipesSectionSkeleton = () => {
  return (
    <HorizontalScrollArea>
      {Array.from({ length: 3 }, (_, index) => (
        <UserRecipeCardSkeleton key={index} />
      ))}
    </HorizontalScrollArea>
  );
};
