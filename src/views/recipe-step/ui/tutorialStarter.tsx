import * as Dialog from "@radix-ui/react-dialog";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { useTutorialActions } from "../hooks/useTutorial";
import { useEffect, useRef } from "react";
import { track } from "@/src/shared/analytics/amplitude";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export function TutorialStarter({ recipeId }: { recipeId: string }) {
  const { hasSeenTutorial, checkSeen } = useTutorialStarterStore();
  const { start } = useTutorialActions();
  const hasTrackedViewRef = useRef(false);

  // tutorial_handsfree_view 이벤트: 모달이 처음 표시될 때 트래킹
  // hasSeenTutorial이 true면 "안 본 상태"이므로 모달이 표시됨
  useEffect(() => {
    if (hasSeenTutorial && !hasTrackedViewRef.current) {
      track("tutorial_handsfree_view", { recipe_id: recipeId });
      hasTrackedViewRef.current = true;
    }
  }, [hasSeenTutorial, recipeId]);

  return (
    <>
      {hasSeenTutorial && (
        <Dialog.Root open={true}>
          <Dialog.Portal>
            <Dialog.Content className="absolute inset-0 z-[1200] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
              <div className="flex flex-col w-full w-[80vw] pb-[20] rounded-2xl bg-white shadow-2xl">
                <Dialog.Title className="text-2xl pt-6 pb-2 font-bold pl-8">
                  음성으로 요리해볼까요?
                </Dialog.Title>
                <p className="text-gray-600 px-8 pb-8 text-lg font-semibold">
                  손을 대지 않고 요리하는 방법을 알려드려요 (30초 소요)
                </p>

                <div className="w-full flex justify-evenly px-5 gap-2">
                  <button
                    onClick={() => {
                      track("tutorial_handsfree_skip", { recipe_id: recipeId });
                      checkSeen();
                    }}
                    className="flex-1 h-[20] bg-gray-500 py-6 flex items-center justify-center rounded-md font-bold text-lg"
                  >
                    괜찮아요
                  </button>
                  <button
                    onClick={() => {
                      track("tutorial_handsfree_step_start", { recipe_id: recipeId });
                      start();
                      checkSeen();
                    }}
                    className="flex-1 h-[20] bg-orange-500 py-6 flex items-center justify-center rounded-md font-bold text-white text-lg"
                  >
                    볼게요
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
