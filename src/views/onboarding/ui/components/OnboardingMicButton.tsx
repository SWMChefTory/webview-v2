import { useState, useEffect } from "react";
import { useSimpleSpeech } from "@/src/views/recipe-step/hooks/useSimpleSpeech";
import { motion } from "motion/react";

interface OnboardingMicButtonProps {
  onNext: () => void;
}

export function OnboardingMicButton({ onNext }: OnboardingMicButtonProps) {
  const [isActive, setIsActive] = useState(false);
  
  const { isListening, error } = useSimpleSpeech({
    recipeId: "onboarding-demo",
    onIntent: (intent) => {
      console.log("Detected intent:", intent);
      if (
        intent === "next" || 
        intent === "다음" || 
        intent?.includes("다음") ||
        intent === "play" // 재생이라고 해도 일단 넘어가는 경험 제공 (유연성)
      ) {
        onNext();
      }
    },
    onVoiceStart: () => setIsActive(true),
    onVoiceEnd: () => setIsActive(false),
  });

  // 에러 발생 시 로그만 남기고 UI는 유지 (사용자 경험 보호)
  useEffect(() => {
    if (error) console.warn("Onboarding Speech Error:", error);
  }, [error]);

  return (
    <button
      className={[
        "relative flex h-[3.75rem] w-[3.75rem] lg:h-[4.5rem] lg:w-[4.5rem] items-center justify-center rounded-full transition active:scale-95 lg:hover:scale-105",
        isActive || isListening
          ? "bg-orange-500 shadow-[0_2px_24px_rgba(251,146,60,0.8)]"
          : "bg-orange-500 shadow-[0_2px_16px_rgba(0,0,0,0.32)]",
      ].join(" ")}
      type="button"
      // 클릭 시 별도 액션 없음 (항상 리스닝 중이거나, useSimpleSpeech가 알아서 처리)
      // 만약 useSimpleSpeech가 클릭 트리거 방식이 아니라면, 여기서 start()를 호출해야 할 수도 있음.
      // useSimpleSpeech 내부를 보니 useEffect로 자동 시작됨.
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 lg:h-10 lg:w-10"
      >
        <path d="M12 1a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
      
      {(isActive || isListening) && (
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
      )}
    </button>
  );
}
