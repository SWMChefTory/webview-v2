import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecipeCreatingViewOpenStore } from "@/src/widgets/recipe-creating-view/recipeCreatingViewOpenStore";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { driverObj } from ".";
import { useIsInTutorialStore } from "@/src/shared/tutorial/isInTutorialStore";

export const FloatingButton = () => {
  const { open } = useRecipeCreatingViewOpenStore();
  const { isInTutorial } = useIsInTutorialStore();
  return (
    <div
      className="fixed z-[100] bottom-[20] right-[20] pb-safe"
    >
      <div
       className="h-[60] w-[60]"
       data-tour="floating-button"
      >
        <SSRSuspense fallback={<FloatingButtonSkeleton />}>
          <Button
            className="border-none bg-orange-500 rounded-full w-full h-full"
            variant="outline"
            aria-label="Submit"
            onClick={() => {
              if (isInTutorial) {
                open("https://www.youtube.com/shorts/XPmywm8Dnx4");
                setTimeout(() => { 
                  driverObj.moveNext();
                }, 500);
                return;
              }
              open("");
            }}
          >
            <FaPlus size={40} className="text-white" />
          </Button>
        </SSRSuspense>
      </div>
    </div>
  );
};

export function FloatingButtonSkeleton() {
  return <Skeleton className="rounded-full w-full h-full" />;
}
