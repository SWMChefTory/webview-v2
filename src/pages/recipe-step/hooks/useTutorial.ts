import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

export enum StepStatus {
  CONTENT = "CONTENT",
  TIMER = "TIMER",
  GUIDE = "GUIDE",
}

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export type TutorialStep = {
  command: string;
  when: string;
  status: StepStatus;
};

type UseTutorialStoreType = {
  steps: TutorialStep[];
  currentStepIndex: number;
  isInTutorial: boolean;
  start: () => void;
  handleNextStep: ({ index }: { index: number }) => void;
  terminate: () => void;
};

const useTutorialStore = create<UseTutorialStoreType>()(
  persist(
    (set, get) => ({
      steps: [
        {
          command: "영상 틀어",
          when: "앗 영상이 멈춰있네요. 영상을 재생하고 싶을 때",
          status: StepStatus.CONTENT,
        },
        {
          command: "영상 멈춰",
          when: "다시 영상을 멈춰볼까요?",
          status: StepStatus.CONTENT,
        },
        {
          command: "다음 단계",
          when: "바로 넘어가고 싶다면, ",
          status: StepStatus.CONTENT,
        },
        {
          command: "타이머 30초 맞춰줘",
          when: "요리하는 시간 항상 기억하기 힘드시죠?",
          status: StepStatus.TIMER,
        },
        {
          command: "",
          when: "",
          status: StepStatus.GUIDE,
        },
      ],
      currentStepIndex: 0,
      isInTutorial: false,
      start: () => {
        set({ isInTutorial: true, currentStepIndex: 0 });
      },
      handleNextStep: ({ index }: { index: number }) => {
        const { currentStepIndex, steps, terminate } = get();
        if (index !== currentStepIndex) {
          return;
        }
        if (currentStepIndex < steps.length - 1) {
          set({ currentStepIndex: currentStepIndex + 1 });
          return;
        }
        terminate();
      },
      terminate: () => {
        set({ isInTutorial: false, currentStepIndex: 0 });
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

export const useTutorial = () => {
  const { steps, currentStepIndex, isInTutorial } = useTutorialStore();
  return { steps, currentStepIndex, isInTutorial };
};

export const useTutorialActions = () => {
  const start = useTutorialStore((state) => state.start);
  const handleNextStep = useTutorialStore((state) => state.handleNextStep);
  const terminate = useTutorialStore((state) => state.terminate);

  return { start, handleNextStep, terminate };
};
