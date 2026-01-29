import * as Dialog from "@radix-ui/react-dialog";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { useTutorialActions } from "../hooks/useTutorial";
import { useEffect, useRef } from "react";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useRecipeStepTranslation } from "../hooks/useRecipeStepTranslation";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export function TutorialStarter({ recipeId }: { recipeId: string }) {
  const { hasSeenTutorial, checkSeen } = useTutorialStarterStore();
  const { start } = useTutorialActions();
  const { t } = useRecipeStepTranslation();
  const hasTrackedViewRef = useRef(false);

  // tutorial_handsfree_view 이벤트: 모달이 처음 표시될 때 트래킹
  // hasSeenTutorial이 true면 "안 본 상태"이므로 모달이 표시됨
  useEffect(() => {
    if (hasSeenTutorial && !hasTrackedViewRef.current) {
      track(AMPLITUDE_EVENT.TUTORIAL_HANDSFREE_VIEW, { recipe_id: recipeId });
      hasTrackedViewRef.current = true;
    }
  }, [hasSeenTutorial, recipeId]);

  return (
    <>
      {hasSeenTutorial && (
        <Dialog.Root open={true}>
          <Dialog.Portal>
            <Dialog.Content className="absolute inset-0 z-[1200] flex items-center justify-center bg-black/70 p-5 lg:p-8 backdrop-blur-sm">
              <div className="flex flex-col w-full w-[80vw] lg:max-w-[500px] xl:max-w-[560px] pb-[20] lg:pb-6 rounded-2xl lg:rounded-3xl bg-white shadow-2xl">
                <Dialog.Title className="text-2xl lg:text-3xl pt-6 lg:pt-8 pb-2 lg:pb-3 font-bold pl-8 lg:pl-10">
                  {t("tutorial.title")}
                </Dialog.Title>
                <p className="text-gray-600 px-8 lg:px-10 pb-8 lg:pb-10 text-lg lg:text-xl font-semibold">
                  {t("tutorial.description")}
                </p>

                <div className="w-full flex justify-evenly px-5 lg:px-6 gap-2 lg:gap-3">
                  <button
                    onClick={() => {
                      track(AMPLITUDE_EVENT.TUTORIAL_HANDSFREE_SKIP, { recipe_id: recipeId });
                      checkSeen();
                    }}
                    className="flex-1 h-[20] bg-gray-500 py-6 lg:py-7 flex items-center justify-center rounded-md lg:rounded-lg font-bold text-lg lg:text-xl lg:hover:bg-gray-600 lg:transition-colors"
                  >
                    {t("tutorial.btnSkip")}
                  </button>
                  <button
                    onClick={() => {
                      track(AMPLITUDE_EVENT.TUTORIAL_HANDSFREE_STEP_START, { recipe_id: recipeId });
                      start();
                      checkSeen();
                    }}
                    className="flex-1 h-[20] bg-orange-500 py-6 lg:py-7 flex items-center justify-center rounded-md lg:rounded-lg font-bold text-white text-lg lg:text-xl lg:hover:bg-orange-600 lg:transition-colors"
                  >
                    {t("tutorial.btnStart")}
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </>
  );
}

type TutorialStarter = {
  hasSeenTutorial: boolean;
  checkSeen: () => void;
};

const useTutorialStarterStore = create<TutorialStarter>()(
  persist(
    (set, get) => ({
      // 변수명은 hasSeenTutorial이지만 로직상 true일 때 모달을 보여주므로,
      // '튜토리얼 대상자 여부'로 동작하고 있습니다.
      hasSeenTutorial: true,
      checkSeen: () => {
        set({ hasSeenTutorial: false });
      },
    }),
    {
      name: "create-popover-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage
      ),
    }
  )
);