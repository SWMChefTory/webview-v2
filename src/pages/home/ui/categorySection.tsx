import React from 'react';
import { useRouter } from 'next/router';
import { 
  CategoryType, 
  CuisineType, 
  RecommendType, 
  getCategoryTypeLabel 
} from '@/src/entities/category/type/cuisineType';

interface CategoryItem {
  type: CategoryType;
  name: string;
  image: string;
}

const categories: CategoryItem[] = [
  {
    type: RecommendType.CHEF,
    name: getCategoryTypeLabel(RecommendType.CHEF),
    image: '/images/category/쉐프_3d.png',
  },
  {
    type: RecommendType.TRENDING,
    name: getCategoryTypeLabel(RecommendType.TRENDING),
    image: '/images/category/급상승_3d.png',
  },
  {
    type: CuisineType.KOREAN,
    name: getCategoryTypeLabel(CuisineType.KOREAN),
    image: '/images/category/한식_3d.png',
  },
  {
    type: CuisineType.SNACK,
    name: getCategoryTypeLabel(CuisineType.SNACK),
    image: '/images/category/분식_3d.png',
  },
  {
    type: CuisineType.CHINESE,
    name: getCategoryTypeLabel(CuisineType.CHINESE),
    image: '/images/category/중식_3d.png',
  },
  {
    type: CuisineType.JAPANESE,
    name: getCategoryTypeLabel(CuisineType.JAPANESE),
    image: '/images/category/일식_3d.png',
  },
  {
    type: CuisineType.WESTERN,
    name: getCategoryTypeLabel(CuisineType.WESTERN),
    image: '/images/category/양식_3d.png',
  },
  {
    type: CuisineType.DESSERT,
    name: getCategoryTypeLabel(CuisineType.DESSERT),
    image: '/images/category/디저트_3d.png',
  },
  {
    type: CuisineType.HEALTHY,
    name: getCategoryTypeLabel(CuisineType.HEALTHY),
    image: '/images/category/건강식_3d.png',
  },
  {
    type: CuisineType.SIMPLE,
    name: getCategoryTypeLabel(CuisineType.SIMPLE),
    image: '/images/category/간편식_3d.png',
  },
];

export const CategorySection = () => {
  const router = useRouter();

  const handleCategoryClick = (category: CategoryItem) => {
    router.push({
      pathname: '/category-results',
      query: { type: category.type },
    });
  };

  return (
    <div className="w-full pt-4 pb-4 bg-white">
      <div className="px-4 mb-2">
        <h2 className="text-xl font-semibold text-gray-900">요리 카테고리</h2>
      </div>
      
      {/* 5열 2행 그리드 */}
      <div className="grid grid-cols-5 gap-x-2 gap-y-2 px-4">
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
                alt={category.name}
                className="w-full h-full object-contain"
              />
            </div>
            {/* 카테고리 이름 */}
            <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};