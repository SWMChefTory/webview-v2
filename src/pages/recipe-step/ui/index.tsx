// --- Single-file Step Page (Next.js, Tailwind only) ---
// - 데이터 스키마: { videoInfo, steps, ingredients, tags, briefings, detailMeta }
// - 헤더 JSX: 사용자 제공 코드 그대로 사용
// - useFetchRecipe(id)로 데이터 로드
// - 외부 CSS/라이브러리 없이 Tailwind만 사용
// - VoiceGuide: 제공한 내용 그대로 Tailwind로 구현
// - 기능: 현재 단계 최상단 스냅, 그룹별 세부 단계 번호(1부터), 진행바 부드럽게 채움,
//        마지막 세그먼트는 영상 총 길이 기준, 로딩 시 진행바 가짜 완료 방지,
//        그룹 반복(다음 그룹으로 넘어가지 않음), 사용자가 직접 시킹 시 즉시 동기화

import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import Header, { BackButton } from "@/src/shared/ui/header";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import {TimerBottomSheet} from "@/src/widgets/timer/timerBottomSheet";

/* ---------------------------
   타입
----------------------------*/
type StepDetail = { text: string; start: number };
type StepItem = {
  id: string;
  stepOrder: number;
  subtitle: string;
  details: StepDetail[];
};

type RecipeAPIData = {
  videoInfo?: {
    id?: string; // YouTube video id
    videoTitle?: string;
    videoSeconds?: number; // 총 길이(초)
  };
  steps?: StepItem[];
  ingredients?: { name: string; amount?: number; unit?: string }[];
  tags?: { name: string }[];
  briefings?: { content: string }[];
  detailMeta?: { description?: string; servings?: number; cookTime?: number };
};

/* ---------------------------
   YouTube Iframe API
----------------------------*/
type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (s: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
};

function useYouTubeIframeAPI() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).YT?.Player) {
      setReady(true);
      return;
    }
    const existing = document.getElementById("youtube-iframe-api");
    if (!existing) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
    (window as any).onYouTubeIframeAPIReady = () => setReady(true);
  }, []);
  return ready;
}

function YouTubePlayer({
  youtubeEmbedId,
  title,
  autoplay,
  onPlayerReady,
  onStateChange,
}: {
  youtubeEmbedId: string;
  title: string;
  autoplay?: boolean;
  onPlayerReady?: (player: YTPlayer) => void;
  onStateChange?: (e: { data: number }) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const apiReady = useYouTubeIframeAPI();

  useEffect(() => {
    if (!apiReady || !containerRef.current) return;

    const player = new (window as any).YT.Player(containerRef.current, {
      videoId: youtubeEmbedId,
      playerVars: {
        autoplay: autoplay ? 1 : 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          const wrapper: YTPlayer = {
            playVideo: () => player.playVideo(),
            pauseVideo: () => player.pauseVideo(),
            seekTo: (s: number, allowSeekAhead?: boolean) =>
              player.seekTo(s, allowSeekAhead ?? true),
            getCurrentTime: () => player.getCurrentTime?.() ?? 0,
            getDuration: () => player.getDuration?.() ?? 0,
          };
          onPlayerReady?.(wrapper);
        },
        onStateChange: (event: any) => {
          onStateChange?.({ data: event?.data });
        },
      },
    });

    return () => {
      try {
        player?.destroy?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiReady, youtubeEmbedId]);

  return (
    <div className="relative w-full" aria-label={title} role="region">
      <div className="relative w-full pb-[56.25%]">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  );
}

/* ---------------------------
   오리엔테이션
----------------------------*/
function useOrientation(): boolean {
  const [isLandscape, setIsLandscape] = useState(false);
  useEffect(() => {
    const mq =
      typeof window !== "undefined"
        ? window.matchMedia("(orientation: landscape)")
        : null;
    const onChange = () => setIsLandscape(!!mq?.matches);
    onChange();
    mq?.addEventListener?.("change", onChange);
    return () => mq?.removeEventListener?.("change", onChange);
  }, []);
  return isLandscape;
}

/* ---------------------------
   STEP 내비게이션
----------------------------*/
function useRecipeStepNavigation({
  steps,
  ytRef,
  onTimeUpdate,
}: {
  steps: StepItem[];
  ytRef: React.MutableRefObject<YTPlayer | null>;
  onTimeUpdate?: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0);

  const goToSpecificDetail = useCallback(
    (stepIndex: number, detailIndex: number) => {
      setCurrentStep(stepIndex);
      setCurrentDetailIndex(detailIndex);
      const start = steps[stepIndex]?.details?.[detailIndex]?.start;
      if (typeof start === "number") ytRef.current?.seekTo(start, true);
    },
    [steps, ytRef]
  );

  const goToStep = useCallback(
    (stepNumOneBased: number) => {
      const stepIndex = Math.max(
        0,
        Math.min(steps.length - 1, stepNumOneBased - 1)
      );
      goToSpecificDetail(stepIndex, 0);
    },
    [steps.length, goToSpecificDetail]
  );

  const goToNextStep = useCallback(() => {
    const last = steps.length - 1;
    if (currentStep < last) goToSpecificDetail(currentStep + 1, 0);
  }, [currentStep, steps.length, goToSpecificDetail]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) goToSpecificDetail(currentStep - 1, 0);
  }, [currentStep, goToSpecificDetail]);

  const getCurrentStepDisplay = useCallback(() => {
    const localStepNumber = currentDetailIndex + 1; // 그룹 내 번호
    const step = steps[currentStep];
    const detail = step?.details?.[currentDetailIndex];
    return {
      alphabetPrefix: String.fromCharCode(65 + currentStep),
      subtitle: step?.subtitle ?? "",
      localStepNumber,
      detailText: detail?.text ?? "",
    };
  }, [steps, currentStep, currentDetailIndex]);

  // 전체 detail 평탄화(그룹 내 번호 포함)
  const getAllDetailsFlat = useCallback(() => {
    const flat: {
      stepIndex: number;
      detailIndex: number;
      localNumber: number; // 그룹 내 번호(1..n)
      subtitle: string;
      text: string;
      start: number;
    }[] = [];
    steps.forEach((st, sIdx) => {
      st.details.forEach((d, dIdx) => {
        flat.push({
          stepIndex: sIdx,
          detailIndex: dIdx,
          localNumber: dIdx + 1,
          subtitle: st.subtitle ?? "",
          text: d.text ?? "",
          start: d.start ?? 0,
        });
      });
    });
    return flat;
  }, [steps]);

  useEffect(() => {
    const id = setInterval(() => onTimeUpdate?.(), 200);
    return () => clearInterval(id);
  }, [onTimeUpdate]);

  return {
    currentStep,
    currentDetailIndex,
    setCurrentStep,
    setCurrentDetailIndex,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    goToSpecificDetail,
    getCurrentStepDisplay,
    getAllDetailsFlat,
  };
}

/* ---------------------------
   진행바 (그룹 단위, 부드러운 채움)
   - 마지막 세그먼트의 끝 = 영상 총 길이(>0일 때만)
----------------------------*/
function ProgressBar({
  steps,
  currentTime,
  videoSeconds,
}: {
  steps: StepItem[];
  currentTime: number;
  videoSeconds?: number;
}) {
  const safeVideoSeconds =
    typeof videoSeconds === "number" && videoSeconds > 0 ? videoSeconds : null;

  const segments = useMemo(() => {
    return steps.map((step, stepIndex) => {
      const stepStart = step.details[0]?.start ?? 0;
      const isLast = stepIndex === steps.length - 1;

      const stepEnd = isLast
        ? safeVideoSeconds ?? stepStart + 10
        : steps[stepIndex + 1].details[0]?.start ?? stepStart + 10;

      const clamped = Math.min(Math.max(currentTime, stepStart), stepEnd);
      const denom = stepEnd - stepStart;
      const ratio = denom <= 0 ? 0 : (clamped - stepStart) / denom;

      const isCompleted = denom > 0 && currentTime >= stepEnd;
      const isCurrent =
        denom > 0 && currentTime >= stepStart && currentTime < stepEnd;

      return {
        stepStart,
        stepEnd,
        progress: isCompleted ? 1 : isCurrent ? ratio : 0,
        isCompleted,
        isCurrent,
      };
    });
  }, [steps, currentTime, safeVideoSeconds]);

  return (
    <div className="w-full">
      <div className="flex h-1.5 w-full gap-1">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="relative h-full flex-1 overflow-hidden rounded-full bg-white/20"
          >
            <div
              className={`absolute inset-y-0 left-0 rounded-full will-change-[width] ${
                seg.isCompleted || seg.isCurrent ? "bg-white" : "bg-white/0"
              } transition-[width] duration-500 ease-out`}
              style={{
                width: seg.isCompleted ? "100%" : `${seg.progress * 100}%`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------
   음성 가이드 모달 (제공한 내용 그대로 Tailwind로 구현)
----------------------------*/
function VoiceGuide({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  if (!isVisible) return null;

  const voiceCommands = [
    {
      command: '"다음 단계"',
      description: "다음 요리 단계로 이동합니다",
      icon: "➡️",
    },
    {
      command: '"이전 단계"',
      description: "이전 요리 단계로 돌아갑니다",
      icon: "⬅️",
    },
    {
      command: '"세 번째 단계로 가줘"',
      description: "특정 단계로 바로 이동합니다",
      icon: "🔢",
    },
    {
      command: '"양파 써는 장면으로 가줘"',
      description: "원하는 장면으로 바로 이동합니다",
      icon: "🎯",
    },
    {
      command: '"타이머 3분 시작/정지"',
      description: "요리 타이머를 시작/정지합니다",
      icon: "⏰",
    },
    {
      command: '"동영상 정지/재생"',
      description: "동영상을 정지/재생합니다",
      icon: "⏯️",
    },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-[800px] animate-[slideUp_.3s_ease-out] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="m-0 text-xl font-bold text-gray-800">
            음성 명령 가이드
          </h2>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-2xl text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-150px)] overflow-y-auto px-6 py-5">
          {/* Step 1 */}
          <div className="mb-4 flex items-start gap-4 rounded-xl bg-gray-50 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-base font-bold text-orange-700">
              1
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold text-gray-800">
                "토리야"라고 말하세요
              </div>
              <div className="text-sm text-gray-500">
                음성 인식 활성화를 시도합니다
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-4 flex items-start gap-4 rounded-xl bg-gray-50 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-base font-bold text-orange-700">
              2
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold text-gray-800">
                효과음과 함께 우측 하단의 버튼이 활성화돼요
              </div>
              <div className="text-sm text-gray-500">
                토리가 듣고 있다는 신호입니다
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-6 flex items-start gap-4 rounded-xl bg-gray-50 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-base font-bold text-orange-700">
              3
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold text-gray-800">
                음성으로 명령해보세요
              </div>
              <div className="text-sm text-gray-500">
                아래와 같은 명령이 가능합니다
              </div>
            </div>
          </div>

          {/* Commands list */}
          <div className="space-y-3">
            {voiceCommands.map((c, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl bg-gray-50 p-4 transition hover:-translate-y-0.5 hover:bg-gray-100"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white shadow">
                  <span className="text-xl">{c.icon}</span>
                </div>
                <div className="flex-1 leading-tight">
                  <div className="mb-0.5 text-base font-semibold text-gray-800">
                    {c.command}
                  </div>
                  <div className="text-sm text-gray-500">{c.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50 p-4">
            <h3 className="mb-2 text-sm font-bold text-orange-700">TIP</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-orange-800">
              <li>큰 목소리로 또박또박 말하면 인식률이 높아져요</li>
              <li>"토리야" 대신 "소리야"라고 불러도 돼요</li>
              <li>음성 버튼이 활성화되고 난 뒤에 명령을 말해주세요</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center border-t border-gray-100 px-6 py-4">
          <button
            className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-orange-200 active:translate-y-0"
            onClick={onClose}
            type="button"
          >
            알겠어요!
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   로딩 오버레이
----------------------------*/
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

/* ---------------------------
   본문: RecipeStep
----------------------------*/
function RecipeStep({
  videoInfo,
  steps,
  recipeId,
  recipeName,
}: {
  videoInfo: NonNullable<RecipeAPIData["videoInfo"]>;
  steps: StepItem[];
  onBack?: () => void;
  recipeId: string;
  recipeName: string;
}) {
  const router = useRouter();
  const isLandscape = useOrientation();

  const [showVoiceGuide, setShowVoiceGuide] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [repeatGroup, setRepeatGroup] = useState(false);

  const ytRef = useRef<YTPlayer | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const currentRowRef = useRef<HTMLDivElement>(null);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const [headerH, setHeaderH] = useState(56);
  const [videoH, setVideoH] = useState<number>(
    typeof window !== "undefined" ? Math.round((window.innerWidth * 9) / 16) : 0
  );
  const [progressH, setProgressH] = useState(36);

  const [videoDuration, setVideoDuration] = useState<number>(
    videoInfo?.videoSeconds ?? 0
  );

  // 재생/사용자 조작/루프 제어용 ref
  const isPlayingRef = useRef(false);
  const prevTimeRef = useRef(0);
  const lastUserSeekAtRef = useRef(0);
  const lastLoopAtRef = useRef(0);

  useEffect(() => {
    const update = () => {
      setHeaderH(headerRef.current?.offsetHeight ?? 56);
      setVideoH(Math.round((window.innerWidth * 9) / 16));
      setProgressH(progressRef.current?.offsetHeight ?? 36);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const {
    currentStep,
    currentDetailIndex,
    setCurrentStep,
    setCurrentDetailIndex,
    goToSpecificDetail,
    getAllDetailsFlat,
  } = useRecipeStepNavigation({
    steps,
    ytRef,
    onTimeUpdate: () => {
      const t = ytRef.current?.getCurrentTime?.() ?? 0;
      setCurrentTime(t);
    },
  });

  const computeGroupBounds = useCallback(
    (stepIdx: number) => {
      const groupStart = steps[stepIdx]?.details?.[0]?.start ?? 0;
      const isLastGroup = stepIdx === steps.length - 1;
      const groupEnd = isLastGroup
        ? videoDuration > 0
          ? videoDuration
          : groupStart + 10
        : steps[stepIdx + 1]?.details?.[0]?.start ?? groupStart + 10;
      return { groupStart, groupEnd };
    },
    [steps, videoDuration]
  );

  const syncByTime = useCallback(() => {
    let t = ytRef.current?.getCurrentTime?.() ?? 0;
    const now = Date.now();

    // 큰 점프는 사용자 시킹으로 간주
    if (Math.abs(t - prevTimeRef.current) > 2.0) {
      lastUserSeekAtRef.current = now;
    }
    prevTimeRef.current = t;

    // 총 길이가 비어있으면 보강
    if (!(videoDuration > 0)) {
      const d = ytRef.current?.getDuration?.() ?? 0;
      if (d > 0) setVideoDuration(d);
    }

    // 반복 활성화 시 그룹 범위를 넘지 못하도록 클램프/루프
    if (repeatGroup) {
      const { groupStart, groupEnd } = computeGroupBounds(currentStep);
      const epsilon = 0.08;
      const userSeekGraceMs = 800;
      const loopCooldownMs = 400;

      const nearOrPastEnd = t >= groupEnd - epsilon;
      const enoughSinceUserSeek =
        now - lastUserSeekAtRef.current > userSeekGraceMs;
      const enoughSinceLastLoop = now - lastLoopAtRef.current > loopCooldownMs;

      if (nearOrPastEnd && enoughSinceUserSeek && enoughSinceLastLoop) {
        const target = Math.max(groupStart + 0.01, 0);
        ytRef.current?.seekTo(target, true);
        lastLoopAtRef.current = now;
        t = target;
      }

      if (enoughSinceUserSeek) {
        if (t < groupStart) t = groupStart;
        if (t >= groupEnd) t = groupEnd - 0.01;
      }
    }

    setCurrentTime(t);

    // 현재 디테일 동기화
    const flat = getAllDetailsFlat();
    const sorted = [...flat].sort((a, b) => a.start - b.start);
    let idx = 0;
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (t >= sorted[i].start) {
        idx = i;
        break;
      }
    }
    const target = sorted[idx];
    if (
      target.stepIndex !== currentStep ||
      target.detailIndex !== currentDetailIndex
    ) {
      setCurrentStep(target.stepIndex);
      setCurrentDetailIndex(target.detailIndex);
    }
  }, [
    currentStep,
    currentDetailIndex,
    getAllDetailsFlat,
    setCurrentDetailIndex,
    setCurrentStep,
    videoDuration,
    repeatGroup,
    computeGroupBounds,
  ]);

  useEffect(() => {
    const id = setInterval(syncByTime, 200);
    return () => clearInterval(id);
  }, [syncByTime]);

  const handleStateChange = useCallback(
    (e: { data: number }) => {
      // 1: PLAYING, 2: PAUSED, 3: BUFFERING 등
      isPlayingRef.current = e.data === 1;
      if (e.data === 1 || e.data === 2 || e.data === 3) syncByTime();
    },
    [syncByTime]
  );

  // 현재 줄을 컨테이너 최상단으로 스냅
  const snapCurrentToTop = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const container = listRef.current;
      const row = currentRowRef.current;
      if (!container || !row) return;
      const top = row.offsetTop - container.offsetTop;
      container.scrollTo({ top, behavior });
    },
    []
  );

  useEffect(() => {
    snapCurrentToTop("smooth");
  }, [currentStep, currentDetailIndex, snapCurrentToTop]);

  /* ---------------------------
     목록 렌더링
  ----------------------------*/
  const renderSteps = () => {
    const flat = getAllDetailsFlat();
    const total = flat.length;
    const safeEnd = (start: number) =>
      videoDuration > 0 ? videoDuration : start + 10;

    return (
      <>
        {flat.map((item, idx) => {
          const start = item.start ?? 0;
          const end =
            idx < total - 1
              ? flat[idx + 1].start ?? start + 10
              : safeEnd(start);

          const denom = end - start;
          let status: "past" | "current" | "future" = "future";
          if (denom > 0 && currentTime >= end) status = "past";
          else if (denom > 0 && currentTime >= start && currentTime < end)
            status = "current";

          const isCurrent =
            status === "current" &&
            item.stepIndex === currentStep &&
            item.detailIndex === currentDetailIndex;

          const prev = flat[idx - 1];
          const showSubtitle = idx === 0 || item.stepIndex !== prev?.stepIndex;

          const base =
            "mb-4 flex items-start gap-3 rounded-2xl px-3 py-3 transition-all duration-300";
          const byStatus =
            status === "current"
              ? "bg-white/10 ring-1 ring-white/30 opacity-100"
              : status === "future"
              ? "opacity-85"
              : "opacity-60";

          const numberCls =
            status === "current"
              ? "text-2xl font-bold text-white"
              : "text-xl font-semibold text-white/80";

          const textCls =
            status === "current"
              ? "text-[1.625rem] leading-snug font-extrabold text-white"
              : "text-xl leading-snug font-semibold text-white/80";

          return (
            <div key={`${item.stepIndex}-${item.detailIndex}`}>
              {showSubtitle && (
                <div className="mb-3">
                  <span className="text-left text-base font-bold text-neutral-400">
                    {String.fromCharCode(65 + item.stepIndex)}. {item.subtitle}
                  </span>
                </div>
              )}

              <div
                ref={isCurrent ? currentRowRef : undefined}
                className={`${base} ${byStatus} cursor-pointer active:scale-95`}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSpecificDetail(item.stepIndex, item.detailIndex);
                }}
                aria-current={isCurrent ? "true" : undefined}
              >
                <span className={`${numberCls} mr-2 select-none`}>
                  {item.localNumber}.
                </span>
                <span className={`${textCls} break-keep`}>{item.text}</span>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const videoId = videoInfo?.id ?? "";
  const videoTitle = videoInfo?.videoTitle ?? "";

  return (
    <div
      className={`cooking-mode flex min-h-screen flex-col bg-black ${
        isLandscape ? "landscape" : "portrait"
      }`}
    >
      {!isInitialized && <LoadingOverlay />}

      {/* 헤더 고정 */}
      <div ref={headerRef} className="fixed left-0 right-0 top-0 z-[1000]">
        <Header
          leftContent={
            <BackButton onClick={() => router.back()} color="text-white" />
          }
          centerContent={
            <div
              className="max-w-[calc(100vw-144px)] overflow-hidden text-ellipsis whitespace-nowrap text-center text-xl font-semibold break-keep break-words text-white"
              title={videoTitle}
            >
              {videoTitle}
            </div>
          }
        />
      </div>

      {/* 유튜브 고정 */}
      <div
        className="fixed left-0 right-0 z-[900] bg-black"
        style={{ top: headerH, height: videoH }}
      >
        <YouTubePlayer
          youtubeEmbedId={videoId}
          title={`${videoTitle} - Step ${currentStep + 1}`}
          autoplay
          onPlayerReady={(player) => {
            ytRef.current = player;
            const d = player.getDuration?.() ?? 0;
            if (d > 0) setVideoDuration(d); // 총 길이 확보
            setIsInitialized(true);
          }}
          onStateChange={handleStateChange}
        />
        {/* Landscape에서 터치로 헤더 숨기기 */}
        {isLandscape && isHeaderVisible && (
          <div
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={() => setIsHeaderVisible(false)}
            onTouchEnd={() => setIsHeaderVisible(false)}
          />
        )}
      </div>

      {/* 프로그레스바 고정 */}
      <div
        ref={progressRef}
        className="fixed left-0 right-0 z-[850] bg-black/60 backdrop-blur-sm px-3 py-2"
        style={{ top: headerH + videoH }}
      >
        <ProgressBar
          steps={steps}
          currentTime={currentTime}
          videoSeconds={videoDuration}
        />
      </div>

      {/* 본문 컨테이너 */}
      <div
        className="fixed left-0 right-0 z-[800] bg-black"
        style={{
          top:
            headerH +
            videoH +
            (progressRef.current?.offsetHeight ?? progressH) +
            12,
          bottom: `calc(${60 + 20 + 16}px + env(safe-area-inset-bottom))`,
        }}
      >
        <section
          ref={listRef}
          className="h-full overflow-y-auto overscroll-none px-4 snap-y snap-start"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {renderSteps()}
          <div className="pb-8" />
        </section>
      </div>

      {/* 하단 플로팅: 좌(타이머) - 중(반복) - 우(가이드) */}
      <div className="fixed bottom-5 left-0 right-0 z-[1000] flex flex-col items-center px-5">
        <div className="flex w-full items-center justify-between">
          {/* 좌측: 타이머 */}
          <TimerBottomSheet type="button" recipeId={recipeId} recipeName={recipeName} />

          {/* 가운데: 그룹 반복 */}
          <div className="flex flex-col items-center gap-2">
            <button
              className={[
                "relative flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full p-2 transition active:scale-95 shadow-[0_2px_16px_rgba(0,0,0,0.32)]",
                repeatGroup
                  ? "bg-gradient-to-b from-orange-600 to-orange-500 ring-2 ring-orange-300 shadow-orange-300/40"
                  : "bg-gradient-to-b from-neutral-700 to-neutral-600",
              ].join(" ")}
              onClick={() => setRepeatGroup((v) => !v)}
              aria-label={`그룹 반복 ${repeatGroup ? "끄기" : "켜기"}`}
              aria-pressed={repeatGroup}
              type="button"
              title={repeatGroup ? "그룹 반복 끄기" : "그룹 반복 켜기"}
            >
              {/* 반복 아이콘 (회전 없음) */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="17 1 21 5 17 9"></polyline>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                <polyline points="7 23 3 19 7 15"></polyline>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
              </svg>

              {/* 비활성 시 아이콘 슬래시 */}
              {!repeatGroup && (
                <svg
                  className="pointer-events-none absolute inset-0 m-auto"
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  fill="none"
                >
                  <line
                    x1="10"
                    y1="34"
                    x2="34"
                    y2="10"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {/* 활성 시 글로우 */}
              {repeatGroup && (
                <span className="pointer-events-none absolute inset-0 rounded-full animate-[pulse_2.4s_ease-in-out_infinite] shadow-[0_0_0_0_rgba(251,146,60,0.45)]" />
              )}
            </button>

            {/* 상태 캡션 */}
            <span
              className={[
                "text-[11px] font-semibold tracking-tight",
                repeatGroup ? "text-orange-300" : "text-neutral-400",
              ].join(" ")}
              aria-live="polite"
            >
              {repeatGroup ? "반복 켜짐" : "반복 꺼짐"}
            </span>
          </div>

          {/* 우측: 음성 가이드 */}
          <button
            className="flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full bg-orange-500 p-2 shadow-[0_2px_16px_rgba(0,0,0,0.32)] transition active:scale-95"
            onClick={() => setShowVoiceGuide(true)}
            aria-label="음성 명령 가이드"
            type="button"
          >
            <img
              src="/tori-idle.png"
              alt="토리"
              className="h-8 w-8 object-contain"
            />
          </button>
        </div>
      </div>

      {/* Voice Guide Modal */}
      <VoiceGuide
        isVisible={showVoiceGuide}
        onClose={() => setShowVoiceGuide(false)}
      />
    </div>
  );
}

/* ---------------------------
   페이지 래퍼
----------------------------*/
const RecipeStepPageReady = ({ id }: { id: string }) => {
  const { data } = useFetchRecipe(id);
  const router = useRouter();

  const videoInfo = (data as RecipeAPIData | undefined)?.videoInfo ?? {};
  const steps = (data as RecipeAPIData | undefined)?.steps ?? [];

  if (!data || !videoInfo?.id || steps.length === 0) {
    return <RecipeStepPageSkeleton />;
  }

  return (
    <RecipeStep
      videoInfo={videoInfo}
      steps={steps}
      recipeId={id}
      recipeName={data.videoInfo.videoTitle ?? ""}
      onBack={() => router.back()}
    />
  );
};

/* ---------------------------
   스켈레톤
----------------------------*/
const RecipeStepPageSkeleton = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-black px-4 py-6 text-white">
      <div className="mb-4">
        <Header
          leftContent={<BackButton onClick={() => router.back()} />}
          centerContent={
            <div
              className="max-w-[calc(100vw-144px)] overflow-hidden text-ellipsis whitespace-nowrap text-center text-xl font-semibold break-keep break-words"
              title="로딩중..."
            >
              로딩중...
            </div>
          }
        />
      </div>
      <div className="space-y-3 pt-6">
        <TextSkeleton />
        <TextSkeleton />
        <TextSkeleton />
      </div>
    </div>
  );
};

export { RecipeStepPageReady, RecipeStepPageSkeleton };

/* ---------------------------
   Tailwind 키프레임 참고(선택)
   @layer utilities {
     @keyframes speechBubbleRepeat {
       0% { opacity: 0; transform: translateY(-50%) translateX(.5rem) }
       5% { opacity: 1; transform: translateY(-50%) translateX(0) }
       60% { opacity: 1; transform: translateY(-50%) translateX(0) }
       65% { opacity: 0; transform: translateY(-50%) translateX(.5rem) }
       100% { opacity: 0; transform: translateY(-50%) translateX(.5rem) }
     }
   }
----------------------------*/
