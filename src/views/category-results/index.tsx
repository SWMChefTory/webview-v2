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
  const typeParam = router.query.type;
  const { t: categoryT } = useCategoryTranslation();

  if(!typeParam){
    return <></>
  }

  const type = typeParam as string;

  const getCategoryLabel = (type: string) => {
    if (toCuisineType(type)) {
      return categoryT(`cuisine.${type}`);
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
          <CategoryResultsContent categoryType={type} />
        </SSRSuspense>
      </div>
    </div>
  );
};

export default CategoryResultsPage;
