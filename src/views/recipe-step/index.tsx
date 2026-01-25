import {
  RecipeStepPageReady,
  RecipeStepPageSkeleton,
} from "@/src/views/recipe-step/ui";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useRouter } from "next/router";


const RecipeStepPage = () => {
  const router = useRouter();
  return (
    <div className="w-full h-full">
        <SSRSuspense fallback={<RecipeStepPageSkeleton />}>
          <RecipeStepPageReady id={router.query.id as string} />
        </SSRSuspense>
    </div>
  );
};


export default RecipeStepPage;