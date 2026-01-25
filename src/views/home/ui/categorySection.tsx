import { useRouter } from "next/router";
import {
  RecommendType,
  toRecommendType,
} from "@/src/entities/recommend-recipe/type/recommendType";
import {
  CuisineType,
  toCuisineType,
} from "@/src/entities/cuisine-recipe/type/cuisineType";
import { useHomeTranslation } from "@/src/views/home/hooks/useHomeTranslation";
import { useCategoryTranslation } from "@/src/entities/category/hooks/useCategoryTranslation";

interface CategoryItem {
  type: CategoryType;
  image: string;
}

type CategoryType = CuisineType | RecommendType;

const categories: CategoryItem[] = [
  {
    type: RecommendType.CHEF,
    image: "/images/category/쉐프_3d.png",
  },
  {
    type: RecommendType.TRENDING,
    image: "/images/category/급상승_3d.png",
  },
  {
    type: CuisineType.KOREAN,
    image: "/images/category/한식_3d.png",
  },
  {
    type: CuisineType.SNACK,
    image: "/images/category/분식_3d.png",
  },
  {
    type: CuisineType.CHINESE,
    image: "/images/category/중식_3d.png",
  },
  {
    type: CuisineType.JAPANESE,
    image: "/images/category/일식_3d.png",
  },
  {
    type: CuisineType.WESTERN,
    image: "/images/category/양식_3d.png",
  },
  {
    type: CuisineType.DESSERT,
    image: "/images/category/디저트_3d.png",
  },
  {
    type: CuisineType.HEALTHY,
    image: "/images/category/건강식_3d.png",
  },
  {
    type: CuisineType.SIMPLE,
    image: "/images/category/간편식_3d.png",
  },
];

export const CategorySection = () => {
  const router = useRouter();
  const { t } = useHomeTranslation();
  const { t: categoryT } = useCategoryTranslation();

  const getCategoryLabel = (type: CategoryType) => {
    const recommendType = toRecommendType(type);
    if (recommendType) {
      return categoryT(`recommend.${type}`);
    }
    return categoryT(`cuisine.${type}`);
  };

  const handleCategoryClick = (category: CategoryItem) => {
    router.push({
      pathname: "/category-results",
      query: { type: category.type },
    });
  };

  return (
    <div className="w-full pt-4 pb-4 bg-white">
      <div className="px-4 md:px-6 mb-2">
        <h2 className="text-xl font-semibold text-gray-900">
          {t("recipeCategory")}
        </h2>
      </div>
      {/* 반응형 그리드: 모바일 5열, 태블릿 6열, 데스크탑 8열 */}
      <div className="grid grid-cols-5 gap-x-2 gap-y-2 px-4 md:px-6 md:grid-cols-6 md:gap-x-3 md:gap-y-3 lg:grid-cols-8 lg:gap-x-4 lg:gap-y-4">
        {categories.map((category) => (
          <button
            key={category.type}
            onClick={() => handleCategoryClick(category)}
            className="flex flex-col items-center justify-center gap-1 active:opacity-70 transition-opacity"
          >
            {/* 둥근 사각형 아이콘 배경 */}
            <div className="w-full aspect-square rounded-4xl bg-gray-100 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <img
                src={category.image}
                alt={getCategoryLabel(category.type)}
                className="w-full h-full object-contain"
              />
            </div>
            {/* 카테고리 이름 */}
            <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
              {getCategoryLabel(category.type)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
