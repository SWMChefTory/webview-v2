import {
  RecipeDetailPageReady,
  RecipeDetailPageSkeleton,
} from "@/src/pages/recipe-detail/ui";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useRouter } from "next/router";

const RecipeDetailPage = () => {
  const router = useRouter();
  const id = router.query.id as string | undefined;

  return (
    <div className="w-full h-dvh bg-white">
      <SSRSuspense fallback={<RecipeDetailPageSkeleton />}>
        {id ? <RecipeDetailPageReady id={id} /> : <RecipeDetailPageSkeleton />}
      </SSRSuspense>
    </div>
  );
};

export default RecipeDetailPage;
