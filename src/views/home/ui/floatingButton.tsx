import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecipeCreatingViewOpenStore } from "@/src/widgets/recipe-creating-view/recipeCreatingViewOpenStore";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import * as Popover from "@radix-ui/react-popover";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

export const FloatingButton = () => {
  const { open } = useRecipeCreatingViewOpenStore();
  const { checkClicked } = usefloatingButtonStore();
  return (
    <div className="fixed z-[100] bottom-[20] right-[20] pb-safe">
      <div className="h-[60] w-[60]">
        <SSRSuspense fallback={<FloatingButtonSkeleton />}>
          <FloatingButtonPopover
            trigger={
              <div className="h-[60] w-[60]">
                <Button
                  className="relative w-full h-full rounded-full border-none 
              bg-gradient-to-b from-orange-400 to-orange-600
              shadow-[0_4px_10px_rgba(0,0,0,0.25)]
              active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.3)]
              transition-all duration-150"
                  variant="outline"
                  aria-label="Submit"
                  onClick={() => {
                    checkClicked();
                    open("", "floating_button");
                  }}
                >
                  <FaPlus
                    size={40}
                    className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]"
                  />
                </Button>
              </div>
            }
          />
        </SSRSuspense>
      </div>
    </div>
  );
};

function FloatingButtonPopover({ trigger }: { trigger: React.ReactNode }) {
  const { hasEverClicked } = usefloatingButtonStore();

  return (
    <Popover.Root open={!hasEverClicked}>
      <Popover.Trigger>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="flex flex-col bg-orange-500 rounded-lg shadow-xl z-[2000]"
          side="top"
          align="end"
          sideOffset={2}
          alignOffset={10}
        >
          <Popover.Arrow fill="#f97316" />
          <div className="px-4 py-2 text-white font-bold">레시피 생성하기</div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function FloatingButtonSkeleton() {
  return <Skeleton className="rounded-full w-full h-full" />;
}

type FloatingButtonStoreType = {
  hasEverClicked: boolean;
  checkClicked: () => void;
};
const usefloatingButtonStore = create<FloatingButtonStoreType>()(
  persist(
    (set, get) => ({
      hasEverClicked: false,
      checkClicked: () => {
        set({ hasEverClicked: true });
      },
    }),
    {
      name: "step-tutorial-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage
      ),
    }
  )
);
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
