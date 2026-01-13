import { IoChevronForwardOutline } from "react-icons/io5";
import {
  CategoryChip,
  ChipType,
} from "@/src/entities/category/ui/categoryChip";
import {
  useFetchCategories,
  Category,
} from "@/src/entities/category/model/useCategory";
import { motion } from "motion/react";
import {
  ALL_RECIPES,
  useFetchUserRecipes,
} from "@/src/entities/user-recipe/model/useUserRecipe";
import RecipeBook from "@/src/views/home/ui/assets/recipe-book.png";
import { useRouter } from "next/router";
import { useHomeTranslation } from "../hooks/useHomeTranslation";
import { useTranslation } from "next-i18next";

/**
 * 공통 컴포넌트: 모바일/태블릿 모두 사용
 */

/**
 * "내 레시피" 타이틀 (북 아이콘 + 텍스트 + 화살표)
 * 클릭 시 /user/recipes로 이동
 */
export const MyRecipeTitleReady = () => {
  const { t } = useHomeTranslation();
  const router = useRouter();
  return (
    <div className="w-full h-full">
      <motion.div
        className="h-[32px] md:h-[36px] flex flex-row items-center pl-4 md:pl-0 text-xl md:text-2xl font-semibold"
        whileTap={{ opacity: 0.2 }}
        transition={{ duration: 0.2 }}
        onClick={() => {
          router.push("/user/recipes");
        }}
      >
        <img src={RecipeBook.src} className="size-6 md:size-7" alt="Recipe Book" />
        <div className="pr-1" />
        {t("myRecipe")}
        <IoChevronForwardOutline className="size-6 md:size-7" color="black" />
      </motion.div>
    </div>
  );
};

/**
 * 카테고리 리스트 로딩 Skeleton
 */
export const CategoryListSkeleton = () => {
  return (
    <CategoryChip fontSize="text-sm" props={{ type: ChipType.SKELETON }} />
  );
};

/**
 * 카테고리 필터 리스트 (가로 스크롤)
 * "전체" + 사용자 카테고리들
 */
export const CategoryListReady = ({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: Category | typeof ALL_RECIPES;
  setSelectedCategory: (category: Category | typeof ALL_RECIPES) => void;
}) => {
  const { data: categories } = useFetchCategories();
  const { totalElements } = useFetchUserRecipes(ALL_RECIPES);
  const { t } = useTranslation("user-recipe");

  return (
    <>
      <CategoryChip
        key={ALL_RECIPES}
        props={{
          type: ChipType.FILTER,
          name: t("category.all"),
          accessary: totalElements ?? 0,
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
