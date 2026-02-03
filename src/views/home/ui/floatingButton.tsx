import { Button } from "@/components/ui/button";
import { FaPlus, FaYoutube, FaPencil, FaXmark } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecipeCreatingViewOpenStore } from "@/src/widgets/recipe-creating-form/recipeCreatingFormOpenStore";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import * as Popover from "@radix-ui/react-popover";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { useHomeTranslation } from "../hooks/useHomeTranslation";
import { request } from "@/src/shared/client/native/client";
import { MODE } from "@/src/shared/client/native/client";
import { UNBLOCKING_HANDLER_TYPE } from "@/src/shared/client/native/unblockingHandlerType";
import { useEffect } from "react";

export const FloatingButton = () => {
  const { open } = useRecipeCreatingViewOpenStore();
  const { checkClicked, isExpanded, toggleExpanded } = usefloatingButtonStore();
  const { t } = useHomeTranslation();

  const handleClick = () => {
    checkClicked();
    if (usefloatingButtonStore.getState().hasEverClicked) {
      toggleExpanded();
    } else {
      open("", "floating_button");
    }
  };

  return (
    <div className="fixed z-[100] bottom-[20px] right-[20px] md:bottom-10 md:right-10 lg:bottom-12 lg:right-12 xl:bottom-16 xl:right-16 pb-safe">
      <div className="h-[60px] w-[60px] md:h-[72] md:w-[72] lg:h-20 lg:w-20 xl:h-24 xl:w-24">
        <SSRSuspense fallback={<FloatingButtonSkeleton />}>
          <FloatingButtonPopover
            trigger={
              <div className="h-[60px] w-[60px] md:h-[72] md:w-[72] lg:h-20 lg:w-20 xl:h-24 xl:w-24">
                <Button
                  className="relative w-full h-full rounded-full border-none
              bg-gradient-to-b from-orange-400 to-orange-600
              shadow-[0_4px_10px_rgba(0,0,0,0.25)]
              active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.3)]
              transition-transform duration-150 transition-shadow duration-150
              lg:cursor-pointer lg:hover:scale-105 lg:hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)]
              focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
                  variant="outline"
                  aria-label={t("accessibility.floatingButton")}
                  onClick={handleClick}
                >
                  <FaPlus
                    className={`text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14
                      transition-transform duration-300
                      ${isExpanded ? "rotate-45" : "rotate-0"}`}
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
  const { hasEverClicked, isExpanded, toggleExpanded, closeExpanded } = usefloatingButtonStore();
  const { open } = useRecipeCreatingViewOpenStore();
  const { t } = useHomeTranslation();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        closeExpanded();
      }
    };

    if (isExpanded) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isExpanded, closeExpanded]);

  const handleClick = () => {
    if (!hasEverClicked) return;
    toggleExpanded();
  };

  const handleOpenYouTube = () => {
    request(MODE.UNBLOCKING, UNBLOCKING_HANDLER_TYPE.OPEN_YOUTUBE);
    closeExpanded();
  };

  const handleDirectInput = () => {
    open("", "floating_button");
    closeExpanded();
  };

  return (
    <>
      <Popover.Root open={!hasEverClicked}>
        <Popover.Trigger asChild>
          <div onClick={handleClick}>{trigger}</div>
        </Popover.Trigger>
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

      {hasEverClicked && (
        <FloatingButtonExpandedMenu
          isExpanded={isExpanded}
          onClose={closeExpanded}
          onOpenYouTube={handleOpenYouTube}
          onDirectInput={handleDirectInput}
          t={t}
        />
      )}
    </>
  );
}

interface FloatingButtonExpandedMenuProps {
  isExpanded: boolean;
  onClose: () => void;
  onOpenYouTube: () => void;
  onDirectInput: () => void;
  t: (key: string) => string;
}

function FloatingButtonExpandedMenu({
  isExpanded,
  onClose,
  onOpenYouTube,
  onDirectInput,
  t,
}: FloatingButtonExpandedMenuProps) {
  return (
    <>
      {/* Background Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 z-[99] transition-opacity duration-300 ${
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Expanded Menu */}
      <div
        className={`fixed z-[101] bottom-[20px] right-[20px] md:bottom-10 md:right-10 lg:bottom-12 lg:right-12 xl:bottom-16 xl:right-16 pb-safe
          flex flex-col-reverse gap-3 items-end
          transition-opacity duration-300
          ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {/* YouTube Button */}
        <button
          className={`
            w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20
            rounded-full
            bg-[#FF0000]
            shadow-lg hover:shadow-xl
            transition-transform duration-300 transition-opacity duration-300
            flex items-center justify-center
            hover:scale-110 active:scale-95
            focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2
            ${isExpanded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
          `}
          style={{ transitionDelay: isExpanded ? "100ms" : "0ms" }}
          onClick={onOpenYouTube}
          aria-label={t("accessibility.openYouTube")}
          type="button"
        >
          <FaYoutube className="text-white w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-11 xl:h-11" />
        </button>

        {/* Direct Input Button */}
        <button
          className={`
            w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20
            rounded-full
            bg-white
            border-4 border-orange-500
            shadow-lg hover:shadow-xl
            transition-transform duration-300 transition-opacity duration-300
            flex items-center justify-center
            hover:scale-110 active:scale-95
            focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2
            ${isExpanded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
          `}
          style={{ transitionDelay: isExpanded ? "200ms" : "0ms" }}
          onClick={onDirectInput}
          aria-label={t("accessibility.directInput")}
          type="button"
        >
          <FaPencil className="text-orange-500 w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9" />
        </button>
      </div>
    </>
  );
}

export function FloatingButtonSkeleton() {
  return <Skeleton className="rounded-full w-full h-full" />;
}

type FloatingButtonStoreType = {
  hasEverClicked: boolean;
  checkClicked: () => void;
  isExpanded: boolean;
  toggleExpanded: () => void;
  closeExpanded: () => void;
};
const usefloatingButtonStore = create<FloatingButtonStoreType>()(
  persist(
    (set, get) => ({
      hasEverClicked: false,
      checkClicked: () => {
        set({ hasEverClicked: true });
      },
      isExpanded: false,
      toggleExpanded: () => {
        set({ isExpanded: !get().isExpanded });
      },
      closeExpanded: () => {
        set({ isExpanded: false });
      },
    }),
    {
      name: "step-tutorial-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage
      ),
      partialize: (state) => ({
        hasEverClicked: state.hasEverClicked,
      }),
    }
  )
);
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
