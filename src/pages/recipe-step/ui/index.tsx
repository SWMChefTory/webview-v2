// --- Single-file Step Page (Next.js + Tailwind)
// Portrait + Landscape (가로모드) 지원 버전
// - 항상 로컬 STT(Web Speech API) + KWS(ONNX) + VAD 동작
// - STT 결과가 '토리야'면 KWS 활성화
// - KWS 활성화 이후 발생한 STT 결과(웨이크워드 제외)를 서버로 전송 + 콘솔 출력
// - 3초 무음 시 KWS 자동 비활성화
// - 기존: 현재 단계 최상단 스냅, 부드러운 진행바, 그룹 반복, VoiceGuide 모달 포함
// - 추가: 가로모드일 때 영상/목록 좌우 분할 레이아웃 + 상단/하단 UI 동작 개선
// - NEW: 전역 바운스 방지(상하좌우 흰 화면/풀투리프레시 차단)
// - NEW: 세로모드 스크롤 시 유튜브 고정

import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { popoverHandle as micButtonPopoverHandle } from "./micButtonPopover";
import Header, { BackButton } from "@/src/shared/ui/header/header";
import { TimerBottomSheet } from "@/src/widgets/timer/timerBottomSheet";
import { useSimpleSpeech } from "@/src/speech/hooks/useSimpleSpeech";
import { request, MODE } from "@/src/shared/client/native/client";
import {
  popoverHandle,
  TimerButton,
} from "@/src/features/timer/ui/timerButton";
import { useHandleTimerVoiceIntent } from "@/src/pages/recipe-step/hooks/useTimerIntent";
import { Video, VideoRefProps } from "./video";
import { useRecipeStepController } from "../hooks/useRecipeStepController";
import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import { GlobalNoBounce } from "./globalNoBounce";
import { useOrientation } from "../hooks/useOrientation";
import { useSafeArea } from "../hooks/useSafeArea";
import { StepsContent } from "./stepsContent";
import { MicInteractionButton } from "./micButton";
import { LoopSettingButton } from "./loopSettingButton";
import { ProgressBar } from "./progressBar";

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] flex select-none touch-none items-center justify-center bg-white/90">
      <div className="pointer-events-none text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black" />
        <p className="text-sm text-gray-800">로딩중...</p>
      </div>
    </div>
  );
}

type TimerCommandType = "SET" | "STOP" | "START" | "CHECK";

/* =====================================================================================
   Intent 타입 및 파싱
===================================================================================== */
type BasicIntent =
  | "NEXT"
  | "PREV"
  | `TIMESTAMP ${number}`
  | `STEP ${number}`
  | "VIDEO PLAY"
  | "VIDEO STOP"
  | `TIMER ${TimerCommandType} ${number}`
  | `INGREDIENT ${string}`
  | "EXTRA";
function parseIntent(raw: string | undefined): BasicIntent {
  const key = (raw ?? "").trim().toUpperCase();
  console.log("key", key);
  if (key === "NEXT") return "NEXT";
  if (key === "PREV") return "PREV";
  if (key === "VIDEO PLAY") return "VIDEO PLAY";
  if (key === "VIDEO STOP") return "VIDEO STOP";
  if (/^TIMESTAMP\s+\d+$/.test(key)) return key as BasicIntent;
  if (/^STEP\s+\d+$/.test(key)) return key as BasicIntent;
  const timerCmd = "(SET|START|STOP|CHECK)";
  if (new RegExp(`^TIMER\\s+${timerCmd}(?:\\s+\\d+)?$`).test(key)) {
    return key as BasicIntent;
  }
  if (/^INGREDIENT\s+.+$/.test(key)) {
    return key as BasicIntent;
  }
  return "EXTRA";
}

function RecipeStepPageReady({ id }: { id: string }) {
  const { data: recipe } = useFetchRecipe(id);
  const router = useRouter();
  const orientation = useOrientation();

  useSafeArea({ orientation });

  // 뒤로 갈 때 safe area 원상복귀 뒤로가기 눌러도 backpress caching땨뮨애 전애 있던 패이지에서 useEffect실행 안될 수 도 있음. pageshow 혹은 visibilitychange 이벤트 사용해서 처리
  useEffect(() => {
    return () => {
      request(MODE.UNBLOCKING, "SAFE_AREA", {
        top: { color: "#ffffff", isExists: true },
        bottom: { color: "#ffffff", isExists: false },
        left: { color: "#ffffff", isExists: false },
        right: { color: "#ffffff", isExists: false },
      });
    };
  }, []);

  const [isInRepeat, setIsInRepeat] = useState(false); // 그룹 반복
  const [isListeningActive, setIsListeningActive] = useState(false);

  const voiceActiveTimerRef = useRef<number | null>(null); //이건 뭐지

  const micButtonPopover = useRef<popoverHandle | undefined>(undefined);

  // KWS 활성화 타이머 정리
  useEffect(() => {
    return () => {
      if (voiceActiveTimerRef.current) {
        window.clearTimeout(voiceActiveTimerRef.current);
      }
    };
  }, []);

  const videoRef = useRef<VideoRefProps | null>(null);

  const { steps, currentIndex, currentDetailIndex, chageStepByTime } =
    useRecipeStepController({
      recipeId: id,
    });

  function handleChangeStepWithVideoTime({
    stepIndex,
    stepDetailIndex,
  }: {
    stepIndex: number;
    stepDetailIndex: number;
  }) {
    console.log("!!2",steps[stepIndex].details[stepDetailIndex].start);
    videoRef.current?.seekTo({
      time: steps[stepIndex].details[stepDetailIndex].start,
    });
  }

  const timerErrorPopoverRef = useRef<popoverHandle | undefined>(undefined);

  const { handleTimerIntent } = useHandleTimerVoiceIntent({
    recipeId: id,
    recipeName: recipe.videoInfo.videoTitle,
  });

  const micButtonPopoverRef = useRef<micButtonPopoverHandle | undefined>(
    undefined
  );

  const handleMicButtonPopover = (message: string) => {
    micButtonPopoverRef.current?.showMessage(message);
  };

  useSimpleSpeech({
    recipeId: router.query.id as string,
    onVoiceStart: () => {
      // 기존 비활성화 타이머가 있으면 취소
      if (voiceActiveTimerRef.current) {
        window.clearTimeout(voiceActiveTimerRef.current);
        voiceActiveTimerRef.current = null;
      }
      setIsListeningActive(true);
    },
    onVoiceEnd: () => {
      // VAD 종료 1초 후에 UI 효과 비활성화
      voiceActiveTimerRef.current = window.setTimeout(() => {
        setIsListeningActive(false);
        voiceActiveTimerRef.current = null;
      }, 1000);
    },
    onIntent: (intent: any) => {
      const parsedIntent = parseIntent(intent?.base_intent || intent);

      if (parsedIntent === "NEXT") {
        handleChangeStepWithVideoTime({
          stepIndex: currentIndex + 1,
          stepDetailIndex: currentDetailIndex,
        });
        return;
      }
      if (parsedIntent === "VIDEO PLAY") {
        videoRef.current?.play();
        return;
      }
      if (parsedIntent === "VIDEO STOP") {
        videoRef.current?.pause();
        return;
      }
      if (parsedIntent === "PREV") {
        handleChangeStepWithVideoTime({
          stepIndex: currentIndex - 1,
          stepDetailIndex: currentDetailIndex,
        });
        return;
      }
      if (parsedIntent.startsWith("TIMESTAMP")) {
        const sec = Number(parsedIntent.split(/\s+/)[1] ?? "0");
        videoRef.current?.seekTo({ time: Math.max(0, sec) });
        return;
      }
      if (parsedIntent.startsWith("STEP")) {
        const stepNum = Number(parsedIntent.split(/\s+/)[1] ?? "1");
        handleChangeStepWithVideoTime({
          stepIndex: stepNum - 1,
          stepDetailIndex: 0,
        });
        return;
      }
      if (parsedIntent.startsWith("TIMER")) {
        console.log("parsedIntentStart", parsedIntent);
        handleTimerIntent(parsedIntent, (error: string) => {
          timerErrorPopoverRef.current?.showErrorMessage(error);
        });
        return;
      }
      if (parsedIntent.startsWith("INGREDIENT")) {
        const ingredient = parsedIntent.split(/\s+/);
        if (ingredient.length <= 1) {
          return;
        }
        const [_, ingredientName, ingredientAmount, _ingredientUnit] =
          ingredient;
        if (ingredientAmount === "0") {
          handleMicButtonPopover(`영상을 참조해주세요.`);
        }
        const ingredientUnit = (() => {
          const trimmed = _ingredientUnit.trim();

          if (/^[A-Za-z]+$/.test(trimmed)) {
            return trimmed.toLowerCase();
          }
          return _ingredientUnit;
        })();
        handleMicButtonPopover(
          `${ingredientName} ${ingredientAmount} ${ingredientUnit} 필요해요.`
        );
        return;
      }
    },
  });

  //반복재생 함수
  const handleRepeatInGroup = (time: number) => {
    const start = steps[currentIndex].details[0].start;
    const end =
      currentIndex + 1 < steps.length
        ? steps[currentIndex + 1].details[0].start
        : videoRef.current?.getDuration();
    if (!end) {
      throw new Error();
    }
    if (start > time || end < time) {
      if (end + 0.3 < time || start - 0.3 > time) {
        chageStepByTime(time);
        return;
      }
      videoRef.current?.seekTo({ time: start });
      chageStepByTime(start);
      return;
    }
    chageStepByTime(time);
  };

  return (
    <div
      className={`flex ${
        orientation === "portrait" ? "flex-col" : "flex-row"
      } w-[100vw] h-[100vh] overflow-hidden bg-black items-center`}
    >
      {/* {isLandscape && (
          <div className="fixed left-0 right-0 z-[1001] transition-[top] duration-200 will-change-top"></div>
        )} */}
      {orientation === "portrait" && (
        <Header
          leftContent={
            <BackButton
              onClick={() => {
                router.back();
              }}
              color="text-white"
            />
          }
        />
      )}
      <Video
        videoId={recipe.videoInfo.id}
        title={recipe.videoInfo.videoTitle}
        ref={videoRef}
        onInternallyChangeTime={
          isInRepeat ? handleRepeatInGroup : chageStepByTime
        }
        isLandscape={orientation !== "portrait"}
      />
      <ProgressBar
        steps={steps}
        currentDetailStepIndex={currentDetailIndex}
        currentStepIndex={currentIndex}
        isLandscape={orientation !== "portrait"}
        onClick={handleChangeStepWithVideoTime}
      />
      <div
        className={`relative overflow-hidden ${
          orientation !== "portrait" && "h-[100vh]"
        }`}
      >
        <StepsContent
          currentDetailStepIndex={currentDetailIndex}
          currentStepIndex={currentIndex}
          onChangeStep={handleChangeStepWithVideoTime}
          steps={steps}
          isLandscape={orientation !== "portrait"}
        />
        <div className="absolute flex flex-col bottom-[0] left-[0] right-[0] z-[20] pt-[10] pointer-events-none">
          {orientation === "portrait" ? (
            <div className="h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          ) : (
            <></>
          )}
          <div className="flex justify-between bg-black pb-[30] px-[20] pointer-events-auto">
            <TimerBottomSheet
              trigger={
                <TimerButton
                  recipeId={id}
                  recipeName={recipe.videoInfo.videoTitle}
                  errorPopoverRef={timerErrorPopoverRef}
                />
              }
              recipeId={id}
              recipeName={recipe.videoInfo.videoTitle}
              isDarkMode={true}
              isLandscape={false}
            />
            <LoopSettingButton
              isRepeat={isInRepeat}
              onClick={() => {
                setIsInRepeat((v) => !v);
              }}
            />
            <MicInteractionButton isActive={true} ref={micButtonPopoverRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

const RecipeStepPageSkeleton = () => {
  const router = useRouter();
  return (
    <>
      <GlobalNoBounce />
      <div className="h-[100svh] overflow-hidden bg-black px-4 py-6 text-white">
        <div className="mb-4">
          <Header
            leftContent={<BackButton onClick={() => router.back()} />}
            centerContent={
              <div className="max-w-[calc(100vw-144px)] overflow-hidden text-ellipsis whitespace-nowrap text-center text-xl font-semibold">
                로딩중...
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export { RecipeStepPageReady, RecipeStepPageSkeleton };

// const setRepeatGroup = ({ start, end }: { start: number; end: number }) => {
// const duration = videoRef.current?.getDuration();
// if (!duration) {
//   return;
// }
// const firstStepDetail = steps[currentIndex].details[0];
// if (!firstStepDetail) {
//   return;
// }
// const start = firstStepDetail.start;
// const end =
//   currentIndex + 1 < steps.length
//     ? steps[currentIndex + 1].details[0].start
//     : duration;
// videoRef.current?.setGroup({ start, end });
// };
