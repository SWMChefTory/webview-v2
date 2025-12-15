import * as Dialog from "@radix-ui/react-dialog";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { useTutorialActions } from "../hooks/useTutorial";
import { useLangcode } from "@/src/shared/translation/useLangCode";

// 다국어 텍스트 상수
const TEXT = {
  TITLE: {
    ko: "음성으로 요리해볼까요?",
    en: "Shall we cook with voice?",
  },
  DESC: {
    ko: "손을 대지 않고 요리하는 방법을 알려드려요 (30초 소요)",
    en: "Learn how to cook hands-free (takes 30s)",
  },
  BTN_SKIP: {
    ko: "괜찮아요",
    en: "No thanks",
  },
  BTN_START: {
    ko: "볼게요",
    en: "Start",
  },
};

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export function TutorialStarter() {
  const { hasSeenTutorial, checkSeen } = useTutorialStarterStore();
  const { start } = useTutorialActions();
  const lang = useLangcode(); // 언어 설정 가져오기

  return (
    <>
      {hasSeenTutorial && (
        <Dialog.Root open={true}>
          <Dialog.Portal>
            <Dialog.Content className="absolute inset-0 z-[1200] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
              <div className="flex flex-col w-full w-[80vw] pb-[20] rounded-2xl bg-white shadow-2xl">
                <Dialog.Title className="text-2xl pt-6 pb-2 font-bold pl-8">
                  {lang === "ko" ? TEXT.TITLE.ko : TEXT.TITLE.en}
                </Dialog.Title>
                <p className="text-gray-600 px-8 pb-8 text-lg font-semibold">
                  {lang === "ko" ? TEXT.DESC.ko : TEXT.DESC.en}
                </p>

                <div className="w-full flex justify-evenly px-5 gap-2">
                  <button
                    onClick={checkSeen}
                    className="flex-1 h-[20] bg-gray-500 py-6 flex items-center justify-center rounded-md font-bold text-lg text-white" // text-white 추가 (가시성 확보)
                  >
                    {lang === "ko" ? TEXT.BTN_SKIP.ko : TEXT.BTN_SKIP.en}
                  </button>
                  <button
                    onClick={() => {
                      start();
                      checkSeen();
                    }}
                    className="flex-1 h-[20] bg-orange-500 py-6 flex items-center justify-center rounded-md font-bold text-white text-lg"
                  >
                    {lang === "ko" ? TEXT.BTN_START.ko : TEXT.BTN_START.en}
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