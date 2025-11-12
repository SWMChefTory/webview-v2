import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecipeCreatingViewOpenStore } from "@/src/widgets/recipe-creating-view/recipeCreatingViewOpenStore";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { driverObj } from "@/src/features/tutorial/tutorial";
import { useIsInTutorialStore } from "@/src/features/tutorial/isInTutorialStore";

export const FloatingButton = () => {
  const { open } = useRecipeCreatingViewOpenStore();
  const { isInTutorial } = useIsInTutorialStore();
  return (
    <div className="fixed z-[100] bottom-[20] right-[20] pb-safe">
      <div className="h-[60] w-[60]" data-tour="floating-button">
        <SSRSuspense fallback={<FloatingButtonSkeleton />}>
          <Button
            className="relative w-full h-full rounded-full border-none 
    bg-gradient-to-b from-orange-400 to-orange-600
    shadow-[0_4px_10px_rgba(0,0,0,0.25)]
    active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.3)]
    transition-all duration-150"
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
            <FaPlus size={40} className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]" />
          </Button>
        </SSRSuspense>
      </div>
    </div>
  );
};

export function FloatingButtonSkeleton() {
  return <Skeleton className="rounded-full w-full h-full" />;
}
