import {
  RecipeStepPageReady,
  RecipeStepPageSkeleton,
} from "@/src/views/recipe-step/ui";
import { GlobalNoBounce } from "@/src/views/recipe-step/ui";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useRouter } from "next/router";
import { useOrientation } from "@/src/views/recipe-step/useOrientation";
import { useEffect } from "react";

const RecipeStepPage = () => {
  const router = useRouter();
  const { handleUnlockOrientation, handleLockOrientation } = useOrientation();
  useEffect(() => {
    handleUnlockOrientation();
    return () => {
      handleLockOrientation();
    };
  }, []);
  return (
    <>
      <GlobalNoBounce />
      <div className="w-full h-full">
        <SSRSuspense fallback={<RecipeStepPageSkeleton />}>
          <RecipeStepPageReady id={router.query.id as string} />
        </SSRSuspense>
      </div>
    </>
  );
};

export default RecipeStepPage;
