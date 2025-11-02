import Header, { BackButton } from "@/src/shared/ui/header/header";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CategoryResultsSkeleton, CategoryResultsContent } from "./ui";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { CategoryType, getCategoryTypeFromString, getCategoryTypeLabel } from "@/src/entities/category/type/cuisineType";

const CategoryResultsPage = () => {
  const router = useRouter();
  const typeParam = router.query.type as string;
  const [categoryType, setCategoryType] = useState<CategoryType | null>(null);

  useEffect(() => {
    if (router.isReady) {
      if (!typeParam || typeParam.trim() === "") {
        router.replace("/");
      } else {
        const type = getCategoryTypeFromString(typeParam);
        if (!type) {
          router.replace("/");
        } else {
          setCategoryType(type);
        }
      }
    }
  }, [router.isReady, typeParam, router]);

  if (!router.isReady || !typeParam || !categoryType) {
    return null;
  }

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Header
        leftContent={
          <div className="flex flex-row gap-3 w-full h-full items-center justify-start">
            <BackButton onClick={() => router.back()} />
            <h1 className="text-xl font-semibold text-gray-900 truncate">
              {getCategoryTypeLabel(categoryType)}
            </h1>
          </div>
        }
      />
      <div className="flex flex-col w-full h-full overflow-y-scroll">
        <SSRSuspense fallback={<CategoryResultsSkeleton />}>
          <CategoryResultsContent categoryType={categoryType} />
        </SSRSuspense>
      </div>
    </div>
  );
};

export default CategoryResultsPage;

