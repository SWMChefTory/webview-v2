import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IoChevronForwardOutline } from "react-icons/io5";
import {
  CategoryChip,
  ChipType,
} from "@/src/entities/category/ui/categoryChip";
import {
  UserRecipeCardEmpty,
  UserRecipeCardSkeleton,
} from "@/src/pages/home/ui/userRecipeCard";
import {
  useFetchCategories,
  Category,
} from "@/src/entities/category/model/useCategory";
import { useState } from "react";
import { motion } from "motion/react";
import {
  ALL_RECIPES,
  useFetchUserRecipes,
} from "@/src/entities/user_recipe/model/useUserRecipe";
import Link from "next/link";
import { UserRecipeCardReady } from "@/src/pages/home/ui/userRecipeCard";
import RecipeBook from "@/src/pages/home/ui/assets/recipe-book.png";
import { HorizontalScrollArea } from "./horizontalScrollArea";

export const MyRecipesReady = () => {
  const { data: categories } = useFetchCategories();
  const [selectedCategory, setSelectedCategory] = useState<
    Category | typeof ALL_RECIPES
  >(ALL_RECIPES);

  const { totalElements } = useFetchUserRecipes(ALL_RECIPES);

  return (
    <MyRecipesTemplate
      title={<MyRecipeTitleReady />}
      categoryList={
        <CategoryListFilter
          categories={categories}
          selectedCategory={selectedCategory}
          totalElementCount={totalElements}
          setSelectedCategory={setSelectedCategory}
        />
      }
      userRecipesSection={
        <UserRecipesSection selectedCategory={selectedCategory} />
      }
    />
  );
};

export const MyRecipesSkeleton = () => {
  return (
    <MyRecipesTemplate
      title={<MyRecipeTitleSkeleton />}
      categoryList={<CategoryListSkeleton />}
      userRecipesSection={<UserRecipesSectionSkeleton />}
    />
  );
};

const MyRecipesTemplate = ({
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
      <ScrollArea className="whitespace-nowrap w-[100vw]">
        <div className="flex flex-row gap-2 pl-4 min-w-[100.5vw]">
          {categoryList}
        </div>
        <ScrollBar orientation="horizontal" className="opacity-0 z-10" />
      </ScrollArea>
      <div className="h-3" />
      {userRecipesSection}
    </div>
  );
};

const MyRecipeTitleSkeleton = () => {
  return (
    <>
      <div className="h-[44px] flex flex-row items-center pl-4 text-xl font-semibold text-gray-500">
        <img src={RecipeBook.src} className="size-6" />
        <div className="pr-1" />
        나의 레시피
        <IoChevronForwardOutline className="size-6 text-gray-400" />
      </div>
    </>
  );
};

const MyRecipeTitleReady = () => {
  return (
    <Link href="/user/recipes" className="w-full h-full">
      <motion.div
        className="h-[32] flex flex-row items-center pl-4 text-xl font-semibold"
        whileTap={{ opacity: 0.2 }}
        transition={{ duration: 0.2 }}
      >
        <img src={RecipeBook.src} className="size-6" />
        <div className="pr-1" />
        나의 레시피
        <IoChevronForwardOutline className="size-6" color="black" />
      </motion.div>
    </Link>
  );
};

const CategoryListSkeleton = () => {
  return (
    <CategoryChip fontSize="text-sm" props={{ type: ChipType.SKELETON }} />
  );
};

const CategoryListFilter = ({
  categories,
  selectedCategory,
  totalElementCount,
  setSelectedCategory,
}: {
  categories: Category[];
  selectedCategory: Category | typeof ALL_RECIPES;
  totalElementCount: number;
  setSelectedCategory: (category: Category | typeof ALL_RECIPES) => void;
}) => {
  return (
    <>
      <CategoryChip
        key={ALL_RECIPES}
        props={{
          type: ChipType.FILTER,
          name: "전체",
          accessary: totalElementCount ?? 0,
          onClick: () => {
            setSelectedCategory?.(ALL_RECIPES);
          },
          isSelected: selectedCategory === ALL_RECIPES,
        }}
      />
      {categories?.map((category) => (
        <CategoryChip
          key={category.id}
          props={{
            type: ChipType.FILTER,
            name: category.name,
            accessary: category.count,
            onClick: () => {
              setSelectedCategory?.(category);
            },
            isSelected: (selectedCategory as Category).id === category.id,
          }}
        />
      ))}
    </>
  );
};

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
  if (userRecipes.length === 0) {
    return (
      <HorizontalScrollArea>
        <UserRecipeCardEmpty />
      </HorizontalScrollArea>
    );
  }
  return (
    <HorizontalScrollArea
      onReachEnd={() => {
        if (hasNextPage) {
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

const UserRecipesSectionSkeleton = () => {
  return (
    <HorizontalScrollArea>
      {Array.from({ length: 3 }, (_, index) => (
        <UserRecipeCardSkeleton key={index} />
      ))}
    </HorizontalScrollArea>
  );
};
