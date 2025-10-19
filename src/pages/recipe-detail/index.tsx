import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import {
  RecipeDetailPageReady,
  RecipeDetailPageSkeleton,
} from "@/src/pages/recipe-detail/ui";
import Header, {BackButton} from "@/src/shared/ui/header";
import { useRouter } from "next/router";

const RecipeDetailPage = () => {
  const router = useRouter();
  return (
    <div className="w-full h-full">
      <Header color="bg-white" leftContent={<BackButton onClick={() => router.back()} />} />

      <SSRSuspense fallback={<RecipeDetailPageSkeleton />}>
        <RecipeDetailPageReady id={router.query.id as string} />
      </SSRSuspense>
    </div>
  );
};

export default RecipeDetailPage;
