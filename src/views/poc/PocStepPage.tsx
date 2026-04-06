import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  Play,
  Pause,
  Lightbulb,
  Timer,
  Mic,
  MicOff,
} from "lucide-react";
import { getRecipeEntry } from "./mockData";
import { parseTimeToSeconds } from "./utils";
import { usePocSpeech } from "./hooks/usePocSpeech";
import {
  useIntentClassifier,
  type IntentLabel,
} from "./hooks/useIntentClassifier";
import { useSceneMatcher } from "./hooks/useSceneMatcher";
import dynamic from "next/dynamic";

const ReactYouTube = dynamic(() => import("react-youtube"), { ssr: false });

// 명령 실행 피드백용 라벨
const COMMAND_LABELS: Record<string, string> = {
  NEXT_STEP: "➡️ 다음 단계",
  PREV_STEP: "⬅️ 이전 단계",
  PLAY: "▶️ 재생",
  PAUSE: "⏸ 일시정지",
  GO_TO_STEP: "🔢 단계 이동",
  EXTRA: "",
};

export default function PocStepPage() {
  const router = useRouter();
  const { step: stepParam, scene: sceneParam, recipe: recipeParam } = router.query;
  const { recipe: recipeData, videoId } = getRecipeEntry(recipeParam as string | undefined);

  const ytRef = useRef<YT.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initializedRef = useRef(false);

  // URL 쿼리에서 초기값만 읽고, 이후에는 로컬 state로 관리
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number | null>(0);


  const steps = recipeData.steps;
  const currentStep = steps[currentStepIndex] ?? steps[0];
  const totalSteps = steps.length;

  // --- Intent Classifier ---
  const { classify, loadModel, isLoading: isModelLoading } = useIntentClassifier();

  // --- Scene Matcher (현재 단계의 장면 라벨 기반) ---
  const scenes = currentStep.scenes ?? [];
  const sceneLabels = useMemo(
    () => scenes.map((s) => s.label),
    [scenes]
  );
  const { findBestScene, embedScenes, isLoading: isEmbeddingLoading } = useSceneMatcher(sceneLabels);

  // 최신 state를 콜백 안에서 참조하기 위한 ref
  const currentStepIndexRef = useRef(currentStepIndex);
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => { currentStepIndexRef.current = currentStepIndex; }, [currentStepIndex]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // GO_TO_STEP에서 숫자 추출
  const extractStepNumber = useCallback((text: string): number | null => {
    // "3단계", "세번째", "3번" 등에서 숫자 추출
    const digitMatch = text.match(/(\d+)/);
    if (digitMatch) return parseInt(digitMatch[1], 10);

    const koreanNumbers: Record<string, number> = {
      "첫": 1, "하나": 1, "한": 1, "일": 1,
      "두": 2, "둘": 2, "이": 2,
      "세": 3, "셋": 3, "삼": 3,
      "네": 4, "넷": 4, "사": 4,
      "다섯": 5, "오": 5,
    };
    for (const [word, num] of Object.entries(koreanNumbers)) {
      if (text.includes(word)) return num;
    }
    return null;
  }, []);

  // Intent → Action 실행
  const executeIntent = useCallback(
    (intent: IntentLabel, confidence: number, text: string) => {
      // confidence 제한 없이 실행 (디버깅용)
      console.log(`[VoiceCmd] ${intent} (${(confidence * 100).toFixed(0)}%)`);
      if (intent === "EXTRA") return;

      switch (intent) {
        case "NEXT_STEP": {
          const idx = currentStepIndexRef.current;
          if (idx < totalSteps - 1) {
            setCurrentStepIndex(idx + 1);
            setActiveSceneIndex(0);
            const targetStep = steps[idx + 1];
            if (targetStep?.scenes?.[0]) {
              const sec = parseTimeToSeconds(targetStep.scenes![0].start);
              ytRef.current?.pauseVideo();
              ytRef.current?.seekTo(sec, true);
            }
          }
          break;
        }
        case "PREV_STEP": {
          const idx = currentStepIndexRef.current;
          if (idx > 0) {
            setCurrentStepIndex(idx - 1);
            setActiveSceneIndex(0);
            const targetStep = steps[idx - 1];
            if (targetStep?.scenes?.[0]) {
              const sec = parseTimeToSeconds(targetStep.scenes![0].start);
              ytRef.current?.pauseVideo();
              ytRef.current?.seekTo(sec, true);
            }
          }
          break;
        }
        case "PLAY": {
          ytRef.current?.playVideo();
          break;
        }
        case "PAUSE": {
          ytRef.current?.pauseVideo();
          break;
        }
        case "GO_TO_STEP": {
          const stepNum = extractStepNumber(text);
          if (stepNum && stepNum >= 1 && stepNum <= totalSteps) {
            const targetIdx = stepNum - 1;
            setCurrentStepIndex(targetIdx);
            setActiveSceneIndex(0);
            const targetStep = steps[targetIdx];
            if (targetStep?.scenes?.[0]) {
              const sec = parseTimeToSeconds(targetStep.scenes![0].start);
              ytRef.current?.pauseVideo();
              ytRef.current?.seekTo(sec, true);
            }
          }
          break;
        }
      }
    },
    [totalSteps, steps, extractStepNumber]
  );

  // Speech → Intent 분류 → (EXTRA면 장면 매칭) 콜백
  const handleFinalResult = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      const pipelineStart = performance.now();
      console.log(`[VoiceCommand] STT result → starting NLU pipeline: "${text}"`);

      // 1) Intent 분류 시도
      const nluStart = performance.now();
      const result = await classify(text);
      const nluLatency = performance.now() - nluStart;

      if (result && result.intent !== "EXTRA") {
        const totalLatency = performance.now() - pipelineStart;
        console.log(
          `⏱️ [Latency] NLU: ${nluLatency.toFixed(0)}ms → ${result.intent} (${(result.confidence * 100).toFixed(1)}%)`
        );
        console.log(
          `⏱️ [Latency] Pipeline total: ${totalLatency.toFixed(0)}ms (STT→NLU hit)`
        );
        executeIntent(result.intent, result.confidence, text);
        return;
      }

      console.log(
        `⏱️ [Latency] NLU: ${nluLatency.toFixed(0)}ms → EXTRA/no match, falling back to embedding`
      );

      // 2) EXTRA이거나 분류 실패 → 장면 매칭으로 폴백
      const embeddingStart = performance.now();
      const match = await findBestScene(text);
      const embeddingLatency = performance.now() - embeddingStart;
      const totalLatency = performance.now() - pipelineStart;

      if (match && match.score > 0.3) {
        const scene = scenes[match.index];
        if (scene) {
          const seconds = parseTimeToSeconds(scene.start);
          ytRef.current?.seekTo(seconds, true);
          ytRef.current?.playVideo();
          setActiveSceneIndex(match.index);
          console.log(
            `⏱️ [Latency] Embedding: ${embeddingLatency.toFixed(0)}ms → "장면${match.index + 1}. ${match.label}" (${(match.score * 100).toFixed(1)}%)`
          );
          console.log(
            `⏱️ [Latency] Pipeline total: ${totalLatency.toFixed(0)}ms (STT→NLU→Embedding)`
          );
        }
      } else {
        console.log(
          `⏱️ [Latency] Embedding: ${embeddingLatency.toFixed(0)}ms → no match`
        );
        console.log(
          `⏱️ [Latency] Pipeline total: ${totalLatency.toFixed(0)}ms → no action for: "${text}"`
        );
      }
      console.log(`[VoiceCommand] Pipeline ended`);
    },
    [classify, executeIntent, findBestScene, scenes]
  );

  // --- Speech Recognition (TEN VAD + AEC + Web Speech API) ---
  const {
    isListening,
    isSpeechDetected,
    transcript,
    toggleListening: rawToggleListening,
  } = usePocSpeech({ lang: "ko-KR", onFinalResult: handleFinalResult });

  // 마이크 켤 때 모델도 lazy 로드
  const toggleListening = useCallback(() => {
    if (!isListening) {
      loadModel();      // intent 분류 모델
      embedScenes();    // 장면 임베딩 모델 + 현재 단계 장면 임베딩
    }
    rawToggleListening();
  }, [isListening, loadModel, embedScenes, rawToggleListening]);

  // 최초 마운트 시 URL 쿼리에서 초기값 동기화
  useEffect(() => {
    if (initializedRef.current) return;
    if (!router.isReady) return;
    initializedRef.current = true;

    const stepIdx = stepParam ? Number(stepParam) - 1 : 0;
    const sceneIdx = sceneParam !== undefined ? Number(sceneParam) : 0;
    setCurrentStepIndex(stepIdx);
    setActiveSceneIndex(sceneIdx);
  }, [router.isReady, stepParam, sceneParam]);

  // Poll current time → auto-pause at scene end
  useEffect(() => {
    if (!isPlaying || activeSceneIndex === null) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    const scene = scenes[activeSceneIndex];
    if (!scene) return;

    const endSec = parseTimeToSeconds(scene.end);
    pollRef.current = setInterval(() => {
      const current = ytRef.current?.getCurrentTime?.();
      if (current !== undefined && current >= endSec) {
        ytRef.current?.pauseVideo();
        setActiveSceneIndex(null);
        if (pollRef.current) clearInterval(pollRef.current);
      }
    }, 250);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isPlaying, activeSceneIndex, scenes]);

  const seekToScene = useCallback(
    (sceneIndex: number) => {
      const scene = scenes[sceneIndex];
      if (!scene) return;
      const seconds = parseTimeToSeconds(scene.start);
      ytRef.current?.seekTo(seconds, true);
      ytRef.current?.playVideo();
      setActiveSceneIndex(sceneIndex);
    },
    [scenes]
  );

  const navigateStep = useCallback(
    (stepIndex: number, sceneIndex: number = 0) => {
      setCurrentStepIndex(stepIndex);
      setActiveSceneIndex(sceneIndex);

      const targetStep = steps[stepIndex];
      if (targetStep?.scenes?.[sceneIndex]) {
        const seconds = parseTimeToSeconds(targetStep.scenes![sceneIndex].start);
        ytRef.current?.pauseVideo();
        ytRef.current?.seekTo(seconds, true);
      }
    },
    [steps]
  );

  const goToPrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      navigateStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, navigateStep]);

  const goToNextStep = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      navigateStep(currentStepIndex + 1);
    }
  }, [currentStepIndex, totalSteps, navigateStep]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      ytRef.current?.pauseVideo();
    } else {
      ytRef.current?.playVideo();
    }
  }, [isPlaying]);

  const handlePlayerStateChange = useCallback((e: { data: number }) => {
    setIsPlaying(e.data === 1);
  }, []);

  const opts = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 0,
        rel: 0,
        controls: 0,
        modestbranding: 1,
        playsinline: 1,
        start: steps[0]?.scenes?.[0]
          ? Math.floor(parseTimeToSeconds(steps[0].scenes![0].start))
          : 0,
      },
    }),
    [steps]
  );

  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div className="relative w-full h-[100dvh] flex flex-col bg-black overflow-hidden">
      {/* ─── Header ─── */}
      <div className="shrink-0 bg-black z-20">
        <div className="flex items-center justify-between px-3 h-12">
          {/* Left: back */}
          <button
            type="button"
            onClick={() => router.push("/poc/detail")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white
              transition-all duration-150 hover:bg-white/10 active:scale-[0.90] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Center: step info */}
          <span className="text-white text-sm font-semibold">
            STEP {currentStep.order}/{totalSteps}
          </span>

          {/* Right: timer + mic */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full text-white
                transition-all duration-150 hover:bg-white/10 active:scale-[0.90] cursor-pointer"
            >
              <Timer className="w-5 h-5" />
            </button>
            <button
              type="button"
              onPointerDown={(e) => e.preventDefault()}
              onClick={toggleListening}
              className={`relative w-10 h-10 flex items-center justify-center rounded-full
                transition-all duration-200 active:scale-[0.90] cursor-pointer
                ${isSpeechDetected
                  ? "bg-green-500/30 text-green-400 ring-2 ring-green-400/60 shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                  : isListening
                    ? "bg-green-500/15 text-green-400 ring-1 ring-green-400/40"
                    : "text-white hover:bg-white/10"
                }`}
              aria-label={isListening ? "음성 인식 중지" : "음성 인식 시작"}
            >
              {isSpeechDetected && (
                <span className="absolute inset-0 rounded-full animate-vad-pulse" />
              )}
              {isListening ? (
                <Mic className="relative z-10 w-5 h-5" />
              ) : (
                <MicOff className="relative z-10 w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        {/* Step progress bar */}
        <div className="flex gap-1 px-4 pb-2">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => navigateStep(i)}
              className={`flex-1 h-1 rounded-full transition-all duration-200 cursor-pointer
                ${
                  i === currentStepIndex
                    ? "bg-orange-500"
                    : i < currentStepIndex
                      ? "bg-orange-500/40"
                      : "bg-white/20 hover:bg-white/30"
                }`}
            />
          ))}
        </div>
      </div>

      {/* ─── Video ─── */}
      <div className="relative w-full aspect-video shrink-0">
        <ReactYouTube
          videoId={videoId}
          opts={opts}
          onReady={(e) => {
            ytRef.current = e.target;
            const initScene = steps[currentStepIndex]?.scenes?.[activeSceneIndex ?? 0];
            if (initScene) {
              const sec = parseTimeToSeconds(initScene.start);
              e.target.seekTo(sec, true);
            }
          }}
          onStateChange={handlePlayerStateChange}
          className="absolute inset-0"
          iframeClassName="w-full h-full"
          title={currentStep.title}
        />
        <div className="absolute inset-0 z-100 bg-transparent pointer-events-none"/>
      </div>


      {/* ─── Step Content (scrollable) ─── */}
      <div className="flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch] px-4 pt-3 pb-4">
        {/* Step title */}
        <h2 className="text-white text-lg font-bold">{currentStep.title}</h2>

        {/* Description */}
        <div className="mt-3 space-y-2">
          {Array.isArray(currentStep.description)
            ? currentStep.description.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 pl-1 py-1 border-l-2 border-orange-400/60"
                >
                  <span className="text-white/90 text-sm leading-relaxed pl-2">
                    {item.content}
                  </span>
                </div>
              ))
            : <p className="text-white/80 text-sm leading-relaxed">{currentStep.description}</p>
          }
        </div>

        {/* Knowledge */}
        {currentStep.knowledge && (
          <div className="mt-3 px-3.5 py-2.5 bg-blue-500/20 rounded-xl border border-blue-400/30">
            <span className="font-bold text-blue-300 text-xs">핵심: </span>
            {(Array.isArray(currentStep.knowledge) ? currentStep.knowledge : [currentStep.knowledge]).map((k, i, arr) => (
              <p key={i} className="text-blue-200 text-xs leading-relaxed">
                {arr.length > 1 ? `${i + 1}. ` : ""}{k}
              </p>
            ))}
          </div>
        )}

        {/* Scene list (chips) */}
        {scenes.length > 0 && <div className="mt-4">
          <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">
            장면 목록
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {scenes.map((scene, i) => {
              const isActive = i === activeSceneIndex;
              const isActiveAndPlaying = isActive && isPlaying;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => seekToScene(i)}
                  className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                    transition-all duration-150 active:scale-[0.95] cursor-pointer overflow-hidden
                    ${
                      isActive
                        ? "bg-orange-500/25 border border-orange-400/50 text-orange-300"
                        : "bg-white/8 border border-white/15 text-white/70 hover:bg-white/12"
                    }`}
                >
                  {isActiveAndPlaying && (
                    <span className="absolute inset-0 rounded-full animate-scene-pulse" />
                  )}
                  <Mic className={`relative z-10 w-3 h-3 ${
                    isActive ? "text-orange-400" : "text-white/40"
                  }`} />
                  <span className="relative z-10">장면{i + 1}. {scene.label}</span>
                </button>
              );
            })}
          </div>
        </div>}

        {/* Q&A */}
        {currentStep.tip && (
          <div className="mt-3 px-3.5 py-2.5 bg-amber-500/15 rounded-xl border border-amber-400/30">
            <div className="flex items-center gap-1 mb-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">Q&A</span>
            </div>
            {(Array.isArray(currentStep.tip) ? currentStep.tip : [currentStep.tip]).map((t, i, arr) => (
              <p key={i} className="text-amber-200/90 text-xs leading-relaxed">
                {arr.length > 1 ? `${i + 1}. ` : ""}{t}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* ─── Bottom Control Bar ─── */}
      <div className="shrink-0">
        {/* Gradient fade */}
        <div className="h-10 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        <div className="bg-black px-5 pb-3 flex items-center justify-between">
          {/* 이전 */}
          <button
            type="button"
            onClick={goToPrevStep}
            disabled={currentStepIndex === 0}
            className="text-sm font-semibold text-white
              transition-all duration-150
              enabled:hover:text-orange-300 enabled:active:scale-[0.95]
              disabled:text-white/20 disabled:cursor-not-allowed
              cursor-pointer px-3 py-2"
          >
            이전
          </button>

          {/* Play/Pause */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-orange-500
              text-white transition-all duration-150
              hover:bg-orange-400 active:scale-[0.92]
              cursor-pointer shadow-lg shadow-orange-500/30"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          {/* 다음 */}
          <button
            type="button"
            onClick={goToNextStep}
            disabled={currentStepIndex >= totalSteps - 1}
            className="text-sm font-semibold text-white
              transition-all duration-150
              enabled:hover:text-orange-300 enabled:active:scale-[0.95]
              disabled:text-white/20 disabled:cursor-not-allowed
              cursor-pointer px-3 py-2"
          >
            다음
          </button>
        </div>

        {/* Complete button (last step) */}
        {isLastStep && (
          <div className="bg-black px-5 pb-2">
            <button
              type="button"
              onClick={() => router.push("/poc/detail")}
              className="w-full py-3 rounded-xl bg-green-600 text-white text-sm font-bold
                transition-all duration-150 hover:bg-green-500 active:scale-[0.98]
                cursor-pointer"
            >
              요리 완료!
            </button>
          </div>
        )}

        {/* Speech recognition caption bar */}
        {isListening && (
          <div className="bg-black/90 px-4 py-2.5 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className={`shrink-0 w-2.5 h-2.5 rounded-full ${
                isSpeechDetected
                  ? "bg-green-500 animate-pulse"
                  : "bg-gray-500"
              }`} />
              <p className={`text-sm leading-relaxed truncate flex-1 ${
                isSpeechDetected ? "text-white" : "text-white/50"
              }`}>
                {isSpeechDetected
                  ? (transcript || "듣고 있어요...")
                  : "대기 중... (AEC ON)"}
              </p>
              {(isModelLoading || isEmbeddingLoading) && (
                <span className="text-xs text-white/40 shrink-0">
                  {isModelLoading ? "NLU 로딩..." : "장면 임베딩..."}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Safe area */}
        <div className="bg-black h-[env(safe-area-inset-bottom)]" />
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes desc-card-enter {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scene-pulse {
          0% { background-color: rgba(249, 115, 22, 0.15); }
          50% { background-color: rgba(249, 115, 22, 0.35); }
          100% { background-color: rgba(249, 115, 22, 0.15); }
        }
        .animate-scene-pulse {
          animation: scene-pulse 1.5s ease-in-out infinite;
        }
        @keyframes vad-pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
          50% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .animate-vad-pulse {
          animation: vad-pulse 1.2s ease-in-out infinite;
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}} />
    </div>
  );
}

/** 각 작은 step을 플로팅 카드로 표현하는 컴포넌트 */
