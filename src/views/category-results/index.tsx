import Header, { BackButton } from "@/src/shared/ui/header/header";
import { useRouter } from "next/router";
import { CategoryResultsSkeleton, CategoryResultsContent } from "./ui";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import {
  toCuisineType,
} from "@/src/entities/category/type/cuisineType"
import { useCategoryTranslation } from "@/src/entities/category/hooks/useCategoryTranslation";

const CategoryResultsPage = () => {
  const router = useRouter();
  const typeParam = router.query.type ?? router.query.recipeType;
  const videoTypeParam = router.query.videoType;
  const { t: categoryT } = useCategoryTranslation();

  if(!typeParam){
    return <></>
  }

  const type = (Array.isArray(typeParam) ? typeParam[0] : typeParam).toUpperCase();
  const videoType = Array.isArray(videoTypeParam)
    ? videoTypeParam[0]
    : videoTypeParam;

  const getCategoryLabel = (type: string) => {
    if (toCuisineType(type)) {
      return categoryT(`cuisine.${type}`);
    }

    if (type === "POPULAR" && videoType === "SHORTS") {
      return categoryT("recommend.SHORTS_POPULAR");
    }

    return categoryT(`recommend.${type}`);
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Header
        leftContent={
          <div className="flex flex-row gap-3 w-full h-full items-center justify-start">
            <BackButton onClick={() => router.back()} />
            <h1 className="text-xl font-semibold text-gray-900 truncate">
              {getCategoryLabel(type)}
            </h1>
          </div>
        }
      />
      <div className="flex flex-col w-full h-full overflow-y-scroll">
        <SSRSuspense fallback={<CategoryResultsSkeleton />}>
          <CategoryResultsContent categoryType={type} videoType={videoType} />
        </SSRSuspense>
      </div>
    </div>
  );
};

export default CategoryResultsPage;
