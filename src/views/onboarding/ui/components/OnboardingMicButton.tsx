import { useState, useEffect } from "react";
import { useSimpleSpeech } from "@/src/views/recipe-step/hooks/useSimpleSpeech";
import { parseIntent } from "@/src/views/recipe-step/lib/parseIntent";

interface OnboardingMicButtonProps {
  enabled?: boolean;
  onActivate?: () => void;
  onNext: () => void;
  onError?: () => void;
  onListeningChange?: (isListening: boolean) => void;
}

// STT 서버에서 반환하는 Intent 형태
interface IntentResponse {
  base_intent?: string;
  intent?: string;
}

type IntentValue = string | IntentResponse;

// 마이크 아이콘 SVG (활성/비활성 공유)
const MicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 lg:h-10 lg:w-10"
    aria-hidden="true"
  >
    <path d="M12 1a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

// 활성 상태: useSimpleSpeech 훅으로 음성 인식 수행
function ActiveMicButton({ onNext, onError, onListeningChange }: Pick<OnboardingMicButtonProps, 'onNext' | 'onError' | 'onListeningChange'>) {
  const [isActive, setIsActive] = useState(false);

  const { isListening, error } = useSimpleSpeech({
    recipeId: "ec77fa08-f2ec-45e9-a07c-5117bbc7ee9e", // TODO: 임시 실제 레시피 ID - 추후 서버에서 onboarding 전용 recipe_id 허용 필요
    onIntent: (intent: IntentValue) => {
      // Intent 객체 처리 (조리모드 RecipeStep.controller.tsx와 동일)
      const rawIntent = typeof intent === "string"
        ? intent
        : intent?.base_intent ?? intent?.intent ?? "";

      // 디버깅 로그
      console.log("[OnboardingMicButton] rawIntent:", rawIntent);

      // parseIntent 사용 (조리모드와 동일)
      const parsedIntent = parseIntent(rawIntent);

      console.log("[OnboardingMicButton] parsedIntent:", parsedIntent);

      if (
        parsedIntent === "NEXT" ||
        parsedIntent === "VIDEO PLAY" ||
        parsedIntent.startsWith("NEXT") ||  // 안전장치
        parsedIntent.includes("PLAY")
      ) {
        onNext();
      }
    },
    onVoiceStart: () => setIsActive(true),
    onVoiceEnd: () => setIsActive(false),
  });

  useEffect(() => {
    if (error) {
      onError?.();
    }
  }, [error, onError]);

  useEffect(() => {
    onListeningChange?.(isListening);
  }, [isListening, onListeningChange]);

  const isActiveState = isActive || isListening;

  return (
    <button
      className={[
        "relative flex h-[3.75rem] w-[3.75rem] lg:h-[4.5rem] lg:w-[4.5rem] items-center justify-center rounded-full transition active:scale-95 lg:hover:scale-105",
        isActiveState
          ? "bg-orange-500 shadow-[0_2px_24px_rgba(251,146,60,0.8)]"
          : "bg-orange-500 shadow-[0_2px_16px_rgba(0,0,0,0.32)]",
      ].join(" ")}
      type="button"
      aria-label={isActiveState ? "음성 인식 중입니다" : "음성 인식 시작"}
      aria-pressed={isActiveState}
    >
      <MicIcon />

      {isActiveState ? (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-orange-300/60 animate-[listening_1.8s_ease-out_infinite]" />
          <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-orange-400/40 animate-[listening_1.8s_ease-out_infinite_0.9s]" />
          <style jsx>{`
            @keyframes listening {
              0% {
                transform: scale(1);
                opacity: 0.8;
              }
              70% {
                transform: scale(1.8);
                opacity: 0.2;
              }
              100% {
                transform: scale(2.2);
                opacity: 0;
              }
            }
          `}</style>
        </>
      ) : (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-orange-400/50 animate-[micReady_2s_ease-out_infinite]" />
          <style jsx>{`
            @keyframes micReady {
              0% {
                transform: scale(1);
                opacity: 0.5;
              }
              70% {
                transform: scale(1.5);
                opacity: 0;
              }
              100% {
                transform: scale(1.5);
                opacity: 0;
              }
            }
          `}</style>
        </>
      )}
    </button>
  );
}

export function OnboardingMicButton({
  enabled = true,
  onActivate,
  onNext,
  onError,
  onListeningChange,
}: OnboardingMicButtonProps) {
  if (!enabled) {
    // 비활성 상태: 회색 마이크 버튼 + 주목 유도 펄스 (음성 인식 미시작)
    return (
      <button
        onClick={onActivate}
        className="relative flex h-[3.75rem] w-[3.75rem] lg:h-[4.5rem] lg:w-[4.5rem] items-center justify-center rounded-full bg-gray-400 shadow-[0_2px_16px_rgba(0,0,0,0.16)] active:scale-95 lg:hover:scale-105"
        type="button"
        aria-label="마이크를 눌러 음성 인식을 시작하세요"
      >
        <MicIcon />
        <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-gray-400/50 animate-[micAttention_2s_ease-out_infinite]" />
        <style jsx>{`
          @keyframes micAttention {
            0% {
              transform: scale(1);
              opacity: 0.5;
            }
            70% {
              transform: scale(1.5);
              opacity: 0;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `}</style>
      </button>
    );
  }

  return (
    <ActiveMicButton
      onNext={onNext}
      onError={onError}
      onListeningChange={onListeningChange}
    />
  );
}
