import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  Play,
  Pause,
  Lightbulb,
  Timer,
  Mic,
} from "lucide-react";
import { getRecipeEntry } from "../../mockData";
import { parseTimeToSeconds } from "../../utils";
import dynamic from "next/dynamic";

const ReactYouTube = dynamic(() => import("react-youtube"), { ssr: false });

export default function PocStepPage() {
  const router = useRouter();
  const { step: stepParam, scene: sceneParam, recipe: recipeParam } = router.query;
  const { recipe: recipeData, videoId } = getRecipeEntry(recipeParam as string | undefined);

  const ytRef = useRef<YT.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStepIndex = stepParam ? Number(stepParam) - 1 : 0;
  const [activeSceneIndex, setActiveSceneIndex] = useState<number | null>(
    sceneParam !== undefined ? Number(sceneParam) : 0
  );

  const steps = recipeData.steps;
  const currentStep = steps[currentStepIndex] ?? steps[0];
  const totalSteps = steps.length;

  // sceneParam 변경 시 activeSceneIndex 동기화
  useEffect(() => {
    if (sceneParam !== undefined) {
      setActiveSceneIndex(Number(sceneParam));
    }
  }, [sceneParam]);

  // Poll current time → auto-pause at scene end
  useEffect(() => {
    if (!isPlaying || activeSceneIndex === null) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    const scene = currentStep.scenes[activeSceneIndex];
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
  }, [isPlaying, activeSceneIndex, currentStep.scenes]);

  const seekToScene = useCallback(
    (sceneIndex: number) => {
      const scene = currentStep.scenes[sceneIndex];
      if (!scene) return;
      const seconds = parseTimeToSeconds(scene.start);
      ytRef.current?.seekTo(seconds, true);
      ytRef.current?.playVideo();
      setActiveSceneIndex(sceneIndex);
    },
    [currentStep.scenes]
  );

  const navigateStep = useCallback(
    (stepIndex: number, sceneIndex: number = 0) => {
      router.replace(
        `/poc/step?step=${stepIndex + 1}&scene=${sceneIndex}`,
        undefined,
        { shallow: true }
      );
      setActiveSceneIndex(sceneIndex);
    },
    [router]
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
        start: currentStep.scenes[0]
          ? Math.floor(parseTimeToSeconds(currentStep.scenes[0].start))
          : 0,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentStepIndex]
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
              className="w-10 h-10 flex items-center justify-center rounded-full text-white
                transition-all duration-150 hover:bg-white/10 active:scale-[0.90] cursor-pointer"
            >
              <Mic className="w-5 h-5" />
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
          key={currentStepIndex}
          videoId={videoId}
          opts={opts}
          onReady={(e) => {
            ytRef.current = e.target;
          }}
          onStateChange={handlePlayerStateChange}
          iframeClassName="absolute inset-0 z-0"
          title={currentStep.title}
        />
      </div>


      {/* ─── Step Content (scrollable) ─── */}
      <div className="flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch] px-4 pt-2 pb-4">
        {/* Step title */}
        <h2 className="text-white text-lg font-bold">{currentStep.title}</h2>

        {/* Description */}
        <div className="mt-2 bg-white/10 rounded-xl px-3.5 py-3">
          {Array.isArray(currentStep.description) ? (
            <div className="flex flex-col gap-1">
              {currentStep.description.map((item, i) => (
                <p key={i} className="text-white/90 text-sm leading-relaxed">
                  {item.content}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-white/90 text-sm leading-relaxed">
              {currentStep.description}
            </p>
          )}
        </div>

        {/* Knowledge */}
        {currentStep.knowledge && (
          <div className="mt-3 px-3.5 py-2.5 bg-blue-500/20 rounded-xl border border-blue-400/30">
            <p className="text-blue-200 text-xs leading-relaxed">
              <span className="font-bold text-blue-300">핵심: </span>
              {currentStep.knowledge}
            </p>
          </div>
        )}

        {/* Scene list (chips) */}
        <div className="mt-4">
          <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">
            장면 목록
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {currentStep.scenes.map((scene, i) => {
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
                  <span className="relative z-10">{scene.label}</span>
                </button>
              );
            })}
          </div>
        </div>

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

        {/* Safe area */}
        <div className="bg-black h-[env(safe-area-inset-bottom)]" />
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scene-pulse {
          0% { background-color: rgba(249, 115, 22, 0.15); }
          50% { background-color: rgba(249, 115, 22, 0.35); }
          100% { background-color: rgba(249, 115, 22, 0.15); }
        }
        .animate-scene-pulse {
          animation: scene-pulse 1.5s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
