import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { useLangcode } from "@/src/shared/translation/useLangCode"; // 이전 문맥 기반 import

export enum StepStatus {
  CONTENT = "CONTENT",
  TIMER = "TIMER",
  GUIDE = "GUIDE",
}

// 1. 텍스트 데이터를 스토어 밖으로 분리 (상수 관리)
// 다국어 지원을 위해 ko/en 구조로 변경
const TUTORIAL_DATA = [
  {
    status: StepStatus.CONTENT,
    ko: {
      command: "영상 틀어",
      when: "앗 영상이 멈춰있네요. 영상을 재생하고 싶을 때",
    },
    en: {
      command: "Play video",
      when: "Oh, the video is paused. To play it,",
    },
  },
  {
    status: StepStatus.CONTENT,
    ko: {
      command: "영상 멈춰",
      when: "다시 영상을 멈춰볼까요?",
    },
    en: {
      command: "Stop video",
      when: "Shall we stop the video again?",
    },
  },
  {
    status: StepStatus.CONTENT,
    ko: {
      command: "다음 단계",
      when: "바로 넘어가고 싶다면, ",
    },
    en: {
      command: "Next step",
      when: "If you want to move on immediately,",
    },
  },
  {
    status: StepStatus.TIMER,
    ko: {
      command: "타이머 30초 맞춰줘",
      when: "요리하는 시간 항상 기억하기 힘드시죠?",
    },
    en: {
      command: "Set a timer for 30s",
      when: "Hard to keep track of cooking time?",
    },
  },
  {
    status: StepStatus.GUIDE,
    ko: {
      command: "",
      when: "",
    },
    en: {
      command: "",
      when: "",
    },
  },
];

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

// 2. 스토어 타입 정의 변경 (steps 데이터 제거, 상태만 관리)
type UseTutorialStoreType = {
  currentStepIndex: number;
  isInTutorial: boolean;
  start: () => void;
  handleNextStep: ({ index }: { index: number }) => void;
  terminate: () => void;
};

// 3. Zustand 스토어 (데이터 제외, 로직과 인덱스만 유지)
const useTutorialStore = create<UseTutorialStoreType>()(
  persist(
    (set, get) => ({
      currentStepIndex: 0,
      isInTutorial: false,
      start: () => {
        set({ isInTutorial: true, currentStepIndex: 0 });
      },
      handleNextStep: ({ index }: { index: number }) => {
        const { currentStepIndex, terminate } = get();
        // 데이터 길이는 외부 상수 참조
        const maxIndex = TUTORIAL_DATA.length - 1;

        if (index !== currentStepIndex) {
          return;
        }
        if (currentStepIndex < maxIndex) {
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
      // steps 같은 정적 데이터는 persist 하지 않음으로써 버그 방지
    }
  )
);

// 4. Hook에서 언어(lang)와 상태(store)를 결합하여 반환
export const useTutorial = () => {
  const { currentStepIndex, isInTutorial } = useTutorialStore();
  const lang = useLangcode(); // 'ko' | 'en'

  // 현재 언어 설정에 맞춰 steps 배열 생성
  const steps: TutorialStep[] = TUTORIAL_DATA.map((step) => ({
    status: step.status,
    command: step[lang].command,
    when: step[lang].when,
  }));

  return { steps, currentStepIndex, isInTutorial };
};

export const useTutorialActions = () => {
  const start = useTutorialStore((state) => state.start);
  const handleNextStep = useTutorialStore((state) => state.handleNextStep);
  const terminate = useTutorialStore((state) => state.terminate);

  return { start, handleNextStep, terminate };
};