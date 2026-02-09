import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecipeCreatingViewOpenStore } from "@/src/widgets/recipe-creating-form/recipeCreatingFormOpenStore";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import * as Popover from "@radix-ui/react-popover";
import { useHomeTranslation } from "../hooks/useHomeTranslation";

export const FloatingButton = () => {
  const { t } = useHomeTranslation();

  return (
    <div className="fixed z-[100] bottom-[20px] right-[20px] md:bottom-10 md:right-10 lg:bottom-12 lg:right-12 xl:bottom-16 xl:right-16 pb-safe">
      <div className="h-[60px] w-[60px] md:h-[72] md:w-[72] lg:h-20 lg:w-20 xl:h-24 xl:w-24">
        <SSRSuspense fallback={<FloatingButtonSkeleton />}>
          <FloatingButtonPopover />
        </SSRSuspense>
      </div>
    </div>
  );
};

function FloatingButtonPopover() {
  const { hasSeenTutorial } = useRecipeCreatingViewOpenStore();
  const { t } = useHomeTranslation();
  const { open } = useRecipeCreatingViewOpenStore();

  const handleClick = () => {
    open("", "floating_button");
  };

  const buttonContent = (
    <Button
      className="relative w-full h-full rounded-full border-none 
        bg-gradient-to-b from-orange-400 to-orange-600
        shadow-[0_4px_10px_rgba(0,0,0,0.25)]
        active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.3)]
        transition-all duration-150
        lg:cursor-pointer lg:hover:scale-105 lg:hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
      variant="outline"
      aria-label={t("accessibility.floatingButton")}
      onClick={handleClick}
    >
      <FaPlus className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14" />
    </Button>
  );

  if (hasSeenTutorial) {
    return (
      <div className="h-[60px] w-[60px] md:h-[72] md:w-[72] lg:h-20 lg:w-20 xl:h-24 xl:w-24">
        {buttonContent}
      </div>
    );
  }

  return (
    <Popover.Root open={true}>
      <div className="h-[60px] w-[60px] md:h-[72] md:w-[72] lg:h-20 lg:w-20 xl:h-24 xl:w-24">
        <Popover.Trigger asChild>
          {buttonContent}
        </Popover.Trigger>
      </div>
      <Popover.Portal>
        <Popover.Content
          className="flex flex-col bg-orange-500 rounded-lg lg:rounded-xl shadow-xl z-[2000] outline-none"
          side="top"
          align="end"
          sideOffset={2}
          alignOffset={10}
        >
          <Popover.Arrow fill="#f97316" />
          <div className="px-4 py-2 lg:px-5 lg:py-3 text-white font-bold lg:text-base xl:text-lg">
            {t("createRecipe")}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function FloatingButtonSkeleton() {
  return <Skeleton className="rounded-full w-full h-full" />;
}
