import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import {
  RecipeStepPageReady,
  RecipeStepPageSkeleton,
} from "@/src/pages/recipe-step/ui";
import { useRouter } from "next/router";
import Header, { BackButton } from "@/src/shared/ui/header";

const RecipeStepPage = () => {
  const router = useRouter();
  return (
    <div className="w-full h-full">
      <Header color="bg-white" leftContent={<BackButton onClick={() => router.back()} />} />
      <SSRSuspense fallback={<RecipeStepPageSkeleton />}>
        <RecipeStepPageReady id={router.query.id as string} />
      </SSRSuspense>
    </div>
  );
};

export default RecipeStepPage;
