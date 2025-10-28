import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecipeCreatingViewOpenStore {
  isOpen: boolean;
  videoUrl: string;
  isTutorialOpen: boolean;
  hasSeenTutorial: boolean;
  open: (videoUrl: string) => void;
  close: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setUrl: (url: string) => void;
  openTutorial: () => void;
  closeTutorial: () => void;
  markTutorialAsSeen: () => void; // "다시 보지 않음" 체크 시 호출
  openRecipeCreatingView: (videoUrl?: string) => void;
}

export const useRecipeCreatingViewOpenStore = create<RecipeCreatingViewOpenStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      videoUrl: "",
      isTutorialOpen: false,
      hasSeenTutorial: false,
      open: (videoUrl) => {
        // 딥링크로 videoUrl이 있으면 튜토리얼 스킵하고 바로 레시피 만들기 모달 열기
        if (videoUrl && videoUrl.trim().length > 0) {
          set({ isOpen: true, videoUrl });
          return;
        }

        const { hasSeenTutorial } = get();
        // 튜토리얼을 본 적이 없으면 튜토리얼 먼저 표시
        if (!hasSeenTutorial) {
          set({ isTutorialOpen: true, videoUrl });
        } else {
          // 튜토리얼을 이미 봤으면 바로 레시피 만들기 모달 열기
          set({ isOpen: true, videoUrl });
        }
      },
      close: () => set({ isOpen: false, videoUrl: "" }),
      setIsOpen: (isOpen) => set({ isOpen }),
      setUrl: (url) => set({ videoUrl: url }),
      openTutorial: () => set({ isTutorialOpen: true }),
      closeTutorial: () => {
        // 단순히 닫기만 함 (hasSeenTutorial 저장 안 함)
        set({ isTutorialOpen: false });
      },
      markTutorialAsSeen: () => {
        // "다시 보지 않음" 체크 시에만 저장
        set({ hasSeenTutorial: true });
      },
      openRecipeCreatingView: (videoUrl = "") => {
        set({ isOpen: true, videoUrl });
      },
    }),
    {
      name: "recipe-creating-view-store",
      partialize: (state) => ({
        hasSeenTutorial: state.hasSeenTutorial,
      }),
      merge: (persistedState, currentState) => {
        // persist된 상태와 현재 상태를 병합
        return {
          ...currentState,
          ...(persistedState as any),
        };
      },
    }
  )
);