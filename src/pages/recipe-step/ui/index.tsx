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
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import Header, { BackButton } from "@/src/shared/ui/header";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import {TimerBottomSheet} from "@/src/widgets/timer/timerBottomSheet";
import { useSimpleSpeech } from "@/src/speech/hooks/useSimpleSpeech";

/* =====================================================================================
   전역: 바운스/풀투리프레시 방지 + 배경/높이/가로 스크롤 고정
===================================================================================== */
const GlobalNoBounce = () => (
  <style jsx global>{`
    html,
    body,
    #__next {
      width: 100%;
      height: 100%;
      background: #000;
    }
    /* 상하좌우 끌어당김 방지 + 가로 스크롤 숨김 */
    html,
    body {
      position: fixed;
      inset: 0;
      overflow: hidden;
      overscroll-behavior: none;
      touch-action: manipulation;
    }
    html,
    body,
    #__next {
      overflow-x: hidden;
    }
  `}</style>
);

/* =====================================================================================
   타입
===================================================================================== */
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
};

/* =====================================================================================
   YouTube Iframe API
===================================================================================== */
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

// --- YouTubePlayer 컴포넌트 ---
function YouTubePlayer({
  youtubeEmbedId,
  title,
  autoplay,
  onPlayerReady,
  onStateChange,
  forceHeightPx,
  initialSeekSeconds = 0,
  resumePlaying = false,
}: {
  youtubeEmbedId: string;
  title: string;
  autoplay?: boolean;
  onPlayerReady?: (player: YTPlayer) => void;
  onStateChange?: (e: { data: number }) => void;
  forceHeightPx?: number;
  initialSeekSeconds?: number;
  resumePlaying?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const apiReady = useYouTubeIframeAPI();

  const initialSeekRef = useRef(initialSeekSeconds);
  const resumePlayingRef = useRef(resumePlaying);

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
          try {
            const t = Math.max(0, initialSeekRef.current || 0);
            const shouldRestore = t > 0 || resumePlayingRef.current;
            if (shouldRestore) {
              if (t > 0) player.seekTo(t, true);
              if (resumePlayingRef.current) player.playVideo();
              else player.pauseVideo();
            }
          } catch {}
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
  }, [apiReady, youtubeEmbedId, autoplay]);

  // 고정 높이(가로/세로 공용)
  if (forceHeightPx && forceHeightPx > 0) {
    const width = Math.round((forceHeightPx * 16) / 9);
    return (
      <div
        className="relative"
        aria-label={title}
        role="region"
        style={{ height: forceHeightPx }}
      >
        <div className="mx-auto" style={{ width, height: forceHeightPx }}>
          <div
            ref={containerRef}
            className="h-full w-full will-change-transform transform-gpu"
          />
        </div>
      </div>
    );
  }

  // 기본(세로): aspect-ratio 박스 + 안전 최소 높이
  return (
    <div className="relative w-full" aria-label={title} role="region">
      <div className="relative block w-full aspect-video min-h-[1px] overflow-hidden">
        <div
          ref={containerRef}
          className="h-full w-full will-change-transform transform-gpu"
        />
      </div>
    </div>
  );
}

/* =====================================================================================
   오리엔테이션
===================================================================================== */
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

/* =====================================================================================
   STEP 내비게이션 훅
===================================================================================== */
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
    setCurrentDetailIndex(0);
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, last);
      const start = steps[next]?.details?.[0]?.start;
      if (typeof start === "number") ytRef.current?.seekTo(start, true);
      return next;
    });
  }, [steps, ytRef]);

  const goToPreviousStep = useCallback(() => {
    setCurrentDetailIndex(0);
    setCurrentStep((prev) => {
      const next = Math.max(prev - 1, 0);
      const start = steps[next]?.details?.[0]?.start;
      if (typeof start === "number") ytRef.current?.seekTo(start, true);
      return next;
    });
  }, [steps, ytRef]);

  const getAllDetailsFlat = useCallback(() => {
    const flat: {
      stepIndex: number;
      detailIndex: number;
      localNumber: number;
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
    getAllDetailsFlat,
  };
}

/* =====================================================================================
   진행바 (그룹 단위, 부드러운 채움)
===================================================================================== */
function ProgressBar({
  steps,
  currentTime,
  videoSeconds,
  orientation = "portrait",
}: {
  steps: StepItem[];
  currentTime: number;
  videoSeconds?: number;
  orientation?: "portrait" | "landscape";
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
        progress: isCompleted ? 1 : isCurrent ? ratio : 0,
        isCompleted,
        isCurrent,
      };
    });
  }, [steps, currentTime, safeVideoSeconds]);

  if (orientation === "landscape") {
    return (
      <div className="h-full w-1.5">
        <div className="flex h-full w-1.5 flex-col gap-1">
          {segments.map((seg, i) => (
            <div
              key={i}
              className="relative h-full w-full overflow-hidden rounded-full bg-white/20"
            >
              <div
                className={`absolute bottom-0 left-0 w-full rounded-full will-change-[height] ${
                  seg.isCompleted || seg.isCurrent ? "bg-white" : "bg-white/0"
                } transition-[height] duration-500 ease-out`}
                style={{ height: `${seg.progress * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

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
              style={{ width: `${seg.progress * 100}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================================================================================
   VoiceGuide (Tailwind)
===================================================================================== */
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

        <div className="max-h-[calc(90vh-150px)] overflow-y-auto px-6 py-5">
          {/* ...생략: 동일... */}
          <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50 p-4">
            <h3 className="mb-2 text-sm font-bold text-orange-700">TIP</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-orange-800">
              <li>큰 목소리로 또박또박 말하면 인식률이 높아져요</li>
              <li>"토리야" 대신 "소리야"라고 불러도 돼요</li>
              <li>음성 버튼이 활성화되고 난 뒤에 명령을 말해주세요</li>
            </ul>
          </div>
        </div>

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

/* =====================================================================================
   로딩 오버레이
===================================================================================== */
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

/* =====================================================================================
   Intent 타입 및 파싱
===================================================================================== */
type BasicIntent =
  | "NEXT"
  | "PREV"
  | `TIMESTAMP ${number}`
  | `STEP ${number}`
  | "EXTRA";
function parseIntent(raw: string | undefined): BasicIntent {
  const key = (raw ?? "").trim().toUpperCase();
  if (key === "NEXT") return "NEXT";
  if (key === "PREV") return "PREV";
  if (/^TIMESTAMP\s+\d+$/.test(key)) return key as BasicIntent;
  if (/^STEP\s+\d+$/.test(key)) return key as BasicIntent;
  return "EXTRA";
}

/* =====================================================================================
   본문: RecipeStep (Portrait + Landscape 분기 렌더)
===================================================================================== */
function RecipeStep({
  videoInfo,
  steps,
  recipeId,
  recipeName,
}: {
  videoInfo: NonNullable<RecipeAPIData["videoInfo"]>;
  steps: StepItem[];
  recipeId: string;
  recipeName: string;
}) {
  const router = useRouter();
  const isLandscape = useOrientation();

  const [showVoiceGuide, setShowVoiceGuide] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHeaderVisible] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [repeatGroup, setRepeatGroup] = useState(false);
  const [isKwsActiveUI, setIsKwsActiveUI] = useState(false);

  const [isRotating, setIsRotating] = useState(false);
  const rotateTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const onOC = () => {
      setIsRotating(true);
      if (rotateTimerRef.current) window.clearTimeout(rotateTimerRef.current);
      rotateTimerRef.current = window.setTimeout(() => {
        setIsRotating(false);
      }, 350);
    };
    window.addEventListener("orientationchange", onOC);
    return () => {
      window.removeEventListener("orientationchange", onOC);
      if (rotateTimerRef.current) window.clearTimeout(rotateTimerRef.current);
    };
  }, []);

  const persistRef = useRef<{ time: number; wasPlaying: boolean }>({
    time: 0,
    wasPlaying: false,
  });

  // 상단의 refs/state 모음 근처에 추가
  const bottomBarRef = useRef<HTMLDivElement | null>(null);
  const [bottomBarH, setBottomBarH] = useState(0);

  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [sheetH, setSheetH] = useState(40);

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
  const [viewportH, setViewportH] = useState<number>(
    typeof window !== "undefined" ? window.innerHeight : 0
  );

  const rightColRef = useRef<HTMLDivElement | null>(null);
  const [rightColBox, setRightColBox] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });

  type HeaderState = "expanded" | "sheet" | "hidden";
  const [headerState, setHeaderState] = useState<HeaderState>("expanded");

  const dragOriginRef = useRef<"header" | "handle" | null>(null);
  const dragStartYRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  const THRESH_MINOR = 24;
  const THRESH_MAJOR = 32;

  // 가로모드에서 헤더 외의 영역 클릭 시 헤더를 sheet 상태로 변경
  const handleContentClick = useCallback(() => {
    if (isLandscape && headerState === "expanded") {
      setHeaderState("sheet");
    }
  }, [isLandscape, headerState]);

  function nextStateByDrag(
    curr: HeaderState,
    origin: "header" | "handle",
    dy: number
  ): HeaderState {
    if (curr === "expanded") return dy > THRESH_MINOR ? "sheet" : "expanded";
    if (curr === "sheet") {
      if (dy > THRESH_MAJOR) return "hidden";
      if (dy < -THRESH_MINOR) return "expanded";
      return "sheet";
    }
    if (curr === "hidden") return dy < -THRESH_MAJOR ? "sheet" : "hidden";
    return curr;
  }

  const lockScroll = () => {
    document.body.style.overscrollBehaviorY = "contain";
    document.body.style.touchAction = "none";
  };
  const unlockScroll = () => {
    document.body.style.overscrollBehaviorY = "";
    document.body.style.touchAction = "";
  };

  const onPointerMoveHeader = useCallback((ev: PointerEvent) => {
    if (!draggingRef.current) return;
    ev.preventDefault?.();
  }, []);

  const onPointerUpHeader = useCallback((ev: PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    unlockScroll();

    const startY = dragStartYRef.current ?? ev.clientY;
    const dy = startY - ev.clientY;
    dragStartYRef.current = null;

    const origin = dragOriginRef.current ?? "handle";
    dragOriginRef.current = null;

    setHeaderState((curr) => nextStateByDrag(curr as HeaderState, origin, dy));

    window.removeEventListener("pointermove", onPointerMoveHeader as any);
    window.removeEventListener("pointerup", onPointerUpHeader as any);
    window.removeEventListener("pointercancel", onPointerUpHeader as any);
  }, []);

  const onPointerDownHeader = useCallback(
    (ev: React.PointerEvent, origin: "header" | "handle") => {
      ev.preventDefault();
      draggingRef.current = true;
      lockScroll();
      dragOriginRef.current = origin;
      dragStartYRef.current = ev.clientY;
      (ev.currentTarget as HTMLElement).setPointerCapture?.(ev.pointerId);
      window.addEventListener("pointermove", onPointerMoveHeader as any, {
        passive: true,
      });
      window.addEventListener("pointerup", onPointerUpHeader as any);
      window.addEventListener("pointercancel", onPointerUpHeader as any, {
        passive: true,
      });
    },
    []
  );

  const updateRightColBox = useCallback(() => {
    const el = rightColRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRightColBox({ left: Math.round(r.left), width: Math.round(r.width) });
  }, []);

  useEffect(() => {
    const onResize = () => updateRightColBox();
    const onScroll = () => requestAnimationFrame(updateRightColBox);
    updateRightColBox();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [updateRightColBox, isHeaderVisible, headerH, viewportH]);

  useLayoutEffect(() => {
    if (!isLandscape) return;
    let raf1 = 0,
      raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        updateRightColBox();
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isLandscape, updateRightColBox]);

  useEffect(() => {
    if (!rightColRef.current) return;
    const ro = new ResizeObserver(() => updateRightColBox());
    ro.observe(rightColRef.current);
    return () => ro.disconnect();
  }, [updateRightColBox, isLandscape]);

  useEffect(() => {
    const update = () => {
      setHeaderH(headerRef.current?.offsetHeight ?? 56);
      setVideoH(Math.round((window.innerWidth * 9) / 16));
      setProgressH(progressRef.current?.offsetHeight ?? 36);
      setViewportH(window.innerHeight);
      setSheetH(sheetRef.current?.offsetHeight ?? 40);
      setBottomBarH(bottomBarRef.current?.offsetHeight ?? 0);
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  const [videoDuration, setVideoDuration] = useState<number>(
    videoInfo?.videoSeconds ?? 0
  );

  const prevTimeRef = useRef(0);
  const lastUserSeekAtRef = useRef(0);
  const lastLoopAtRef = useRef(0);

  const {
    currentStep,
    currentDetailIndex,
    setCurrentStep,
    setCurrentDetailIndex,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    goToSpecificDetail,
    getAllDetailsFlat,
  } = useRecipeStepNavigation({
    steps,
    ytRef,
    onTimeUpdate: () => {
      const t = ytRef.current?.getCurrentTime?.() ?? 0;
      setCurrentTime(t);
      persistRef.current.time = t;
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

    if (Math.abs(t - prevTimeRef.current) > 2.0) {
      lastUserSeekAtRef.current = now;
    }
    prevTimeRef.current = t;

    if (!(videoDuration > 0)) {
      const d = ytRef.current?.getDuration?.() ?? 0;
      if (d > 0) setVideoDuration(d);
    }

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
    persistRef.current.time = t;

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
      if (e.data === 1) persistRef.current.wasPlaying = true;
      if (e.data === 2 || e.data === 0) persistRef.current.wasPlaying = false;
      if (e.data === 1 || e.data === 2 || e.data === 3) syncByTime();
    },
    [syncByTime]
  );

  // 1) snapCurrentToTop를 아래처럼 교체
  const snapCurrentToTop = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const container = listRef.current;
      const row = currentRowRef.current;
      if (!container || !row) return;

      // 리스트 컨테이너 내부에서 row의 실제 스크롤 위치(컨텐츠 기준 Y) 계산
      const containerRect = container.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      const rowTopInContainer =
        rowRect.top - containerRect.top + container.scrollTop;

      // 세로모드에서는 진행바가 fixed이므로, 진행바 높이 + 여유 8px만큼 보정
      const fixedBarOffset = !isLandscape ? (progressH ?? 36) + 8 : 0;

      const targetTop = Math.max(rowTopInContainer - fixedBarOffset, 0);

      // 2-프레임 래핑은 유지 (레이아웃 확정 후 스크롤)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.scrollTo({ top: targetTop, behavior });
        });
      });
    },
    [isLandscape, progressH]
  );

  useEffect(() => {
    snapCurrentToTop("smooth");
  }, [currentStep, currentDetailIndex, snapCurrentToTop]);

  useSimpleSpeech({
    recipeId: router.query.id as string,
    onKwsActivate: () => setIsKwsActiveUI(true),
    onKwsDeactivate: () => setIsKwsActiveUI(false),
    onIntent: (intent: any) => {
      const now = Date.now();
      const parsedIntent = parseIntent(intent?.base_intent || intent);

      if (parsedIntent === "NEXT") {
        goToNextStep();
        lastUserSeekAtRef.current = now;
        return;
      }
      if (parsedIntent === "PREV") {
        goToPreviousStep();
        lastUserSeekAtRef.current = now;
        return;
      }
      if (parsedIntent.startsWith("TIMESTAMP")) {
        const sec = Number(parsedIntent.split(/\s+/)[1] ?? "0");
        ytRef.current?.seekTo(Math.max(0, sec), true);
        lastUserSeekAtRef.current = now;
        return;
      }
      if (parsedIntent.startsWith("STEP")) {
        const stepNum = Number(parsedIntent.split(/\s+/)[1] ?? "1");
        goToStep(stepNum);
        lastUserSeekAtRef.current = now;
        return;
      }
    },
  });

  /* ---------------------------
     목록 렌더링
  ----------------------------*/
  const renderSteps = () => {
    const flat = steps.flatMap((st, sIdx) =>
      st.details.map((d, dIdx) => ({
        stepIndex: sIdx,
        detailIndex: dIdx,
        localNumber: dIdx + 1,
        subtitle: st.subtitle ?? "",
        text: d.text ?? "",
        start: d.start ?? 0,
      }))
    );

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

          const subtitleCls = isLandscape
            ? "text-left text-sm font-bold text-neutral-400"
            : "text-left text-base font-bold text-neutral-400";

          const numberCls = isLandscape
            ? status === "current"
              ? "text-xl font-bold text-white"
              : "text-base font-semibold text-white/80"
            : status === "current"
            ? "text-2xl font-bold text-white"
            : "text-xl font-semibold text-white/80";

          const textCls = isLandscape
            ? status === "current"
              ? "text-lg leading-snug font-extrabold text-white"
              : "text-base leading-snug font-semibold text-white/80"
            : status === "current"
            ? "text-[1.625rem] leading-snug font-extrabold text-white"
            : "text-xl leading-snug font-semibold text-white/80";

          return (
            <div key={`${item.stepIndex}-${item.detailIndex}`}>
              {showSubtitle && (
                <div className="mb-3">
                  <span className={subtitleCls}>
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
                  // 가로모드에서 단계 클릭 시 헤더를 sheet로 접기
                  if (isLandscape && headerState === "expanded") {
                    setHeaderState("sheet");
                  }
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

  /* =====================
   통합 렌더링
======================*/
  const topPadding =
    headerState === "expanded" ? headerH : headerState === "sheet" ? sheetH : 8;
  const bottomPadding = 16;
  // 가로모드 영상 높이는 sheet 상태 기준으로 고정 (크기 변경 방지)
  const fixedTopForVideoCalc = sheetH;
  const availVideoH = Math.max(
    240,
    viewportH - fixedTopForVideoCalc - bottomPadding
  );

  // --- 세로모드 고정 플레이어용 보정값
  const portraitVideoH = videoH; // 16:9 계산값 재사용
  const portraitFixedTop = headerH;
  const portraitProgressTop = headerH + portraitVideoH;

  return (
    <>
      <GlobalNoBounce />
      {/* 루트: 화면 높이 고정 + 외부 오버플로우 차단 */}
      <div className="flex h-[100svh] w-full flex-col overflow-hidden bg-black">
        {!isInitialized && <LoadingOverlay />}

        {/* 공통 헤더 */}
        <div
          ref={headerRef}
          className={[
            "fixed left-0 right-0 top-0 z-[1000] will-change-transform",
            isRotating ? "" : "transition-transform duration-200",
          ].join(" ")}
          style={{
            transform:
              headerState === "expanded"
                ? "translateY(0)"
                : "translateY(-100%)",
            pointerEvents: headerState === "expanded" ? "auto" : "none",
          }}
        >
          <Header
            fixed={!isLandscape}
            color="bg-black/80 backdrop-blur-sm border-b border-white/10"
            leftContent={
              <BackButton onClick={() => router.back()} color="text-white" />
            }
            centerContent={
              <div
                className="max-w-[calc(100vw-144px)] overflow-hidden text-ellipsis whitespace-nowrap text-center text-xl font-semibold text-white"
                title={videoTitle}
              >
                {videoTitle}
              </div>
            }
          />
          {isLandscape && (
            <div
              className="absolute inset-x-0 bottom-0 h-5 cursor-ns-resize touch-none select-none"
              onPointerDown={(ev) => onPointerDownHeader(ev, "header")}
            />
          )}
        </div>

        {/* 핸들바(가로모드에서만 노출) */}
        {isLandscape && (
          <div
            ref={sheetRef}
            className="fixed left-0 right-0 z-[1001] transition-[top] duration-200 will-change-top"
            style={{
              top: headerState === "expanded" ? Math.max(0, headerH - 8) : 0,
            }}
          >
            <div
              className="mx-auto flex h-10 cursor-ns-resize select-none touch-none items-center justify-center bg-black/60 backdrop-blur-sm"
              onPointerDown={(ev) => onPointerDownHeader(ev, "handle")}
            >
              <span className="block h-1.5 w-10 rounded-full bg-white/80" />
            </div>
          </div>
        )}

        {/* (세로모드 전용) 고정 유튜브 */}
        {!isLandscape && (
          <div
            className="fixed left-0 right-0 z-[920] bg-black"
            style={{ top: portraitFixedTop }}
          >
            <YouTubePlayer
              youtubeEmbedId={videoId}
              title={`${videoTitle} - Step ${currentStep + 1}`}
              autoplay
              forceHeightPx={portraitVideoH}
              initialSeekSeconds={persistRef.current.time}
              resumePlaying={persistRef.current.wasPlaying}
              onPlayerReady={(player) => {
                ytRef.current = player;
                const d = player.getDuration?.() ?? 0;
                if (d > 0) setVideoDuration(d);
                setIsInitialized(true);
              }}
              onStateChange={handleStateChange}
            />
          </div>
        )}

        {/* 본문 레이아웃: 가로면 2열, 세로면 1열. 좌우 바운스 방지 위해 overflow-x-hidden */}
        <div
          className={
            isLandscape
              ? "grid w-full flex-1 grid-cols-[minmax(36vw,auto)_minmax(0,1fr)] gap-3 overflow-x-hidden"
              : "flex flex-1 flex-col overflow-x-hidden"
          }
          style={{
            // 가로: sheet 기준 고정 패딩(크기 변화 방지), 세로: 헤더 + 고정 영상만큼 패딩
            paddingTop: isLandscape
              ? fixedTopForVideoCalc
              : headerH + portraitVideoH,
            paddingBottom: isLandscape ? bottomPadding : 0,
            paddingLeft: isLandscape ? 12 : 0,
            paddingRight: isLandscape ? 12 : 0,
          }}
          onClick={handleContentClick}
        >
          {/* 좌: 영상 */}
          <div
            className={isLandscape ? "relative" : "relative z-[900] bg-black"}
            onClick={() => {
              // 가로모드에서 영상 영역 클릭 시 헤더를 sheet로 접기
              if (isLandscape && headerState === "expanded") {
                setHeaderState("sheet");
              }
            }}
          >
            <div
              className={
                isLandscape
                  ? [
                      "sticky",
                      isRotating ? "" : "transition-[top] duration-200",
                    ].join(" ")
                  : ""
              }
              style={isLandscape ? { top: topPadding } : undefined}
            >
              {/* 가로모드에서만 렌더(세로는 위의 fixed 블록이 담당) */}
              {isLandscape && (
                <YouTubePlayer
                  youtubeEmbedId={videoId}
                  title={`${videoTitle} - Step ${currentStep + 1}`}
                  autoplay
                  forceHeightPx={availVideoH}
                  initialSeekSeconds={persistRef.current.time}
                  resumePlaying={persistRef.current.wasPlaying}
                  onPlayerReady={(player) => {
                    ytRef.current = player;
                    const d = player.getDuration?.() ?? 0;
                    if (d > 0) setVideoDuration(d);
                    setIsInitialized(true);
                  }}
                  onStateChange={handleStateChange}
                />
              )}
            </div>
          </div>

          {/* 우: 진행바 + 텍스트 (내부 스크롤만 허용) */}
          <div
            ref={rightColRef}
            className={
              isLandscape
                ? "relative grid min-h-0 grid-rows-[auto_1fr]"
                : "flex flex-col"
            }
          >
            {/* 진행바: 가로=fixed(핸들바 바로 아래 고정), 세로=fixed */}
            {isLandscape ? (
              <div
                className="fixed z-[850] bg-black/60 px-3 py-2 backdrop-blur-sm"
                style={{
                  top: sheetH,
                  left: rightColBox.left,
                  width: rightColBox.width,
                  opacity: rightColBox.width > 0 ? 1 : 0,
                  pointerEvents: rightColBox.width > 0 ? "auto" : "none",
                }}
                ref={progressRef}
              >
                <ProgressBar
                  steps={steps}
                  currentTime={currentTime}
                  videoSeconds={videoDuration}
                  orientation="portrait"
                />
              </div>
            ) : (
              <div
                className="fixed left-0 right-0 z-[930] bg-black/60 px-3 py-2 backdrop-blur-sm"
                style={{ top: portraitProgressTop }}
                ref={progressRef}
              >
                <ProgressBar
                  steps={steps}
                  currentTime={currentTime}
                  videoSeconds={videoDuration}
                  orientation="portrait"
                />
              </div>
            )}

            {/* 목록 영역: 진행바 침범 방지용 안전 패딩 + 클리핑 */}
            <section
              ref={listRef}
              className={
                isLandscape
                  ? "min-h-0 overflow-y-auto overscroll-none px-2 text-white"
                  : "min-h-0 flex-1 overflow-y-auto overscroll-none px-4 text-white"
              }
              style={{
                WebkitOverflowScrolling: "touch",
                touchAction: "pan-y",
                // 가로: 핸들바(sheetH) + 진행바 높이만큼 패딩, 세로: 진행바 높이만큼 패딩
                paddingTop: isLandscape
                  ? sheetH + (progressH ?? 36) + 8
                  : (progressH ?? 36) + 8,
                paddingBottom: bottomBarH + 8,
                // 스크롤/애니메이션 중 상단으로 튀는 시각적 침범도 잘라내기
                overflowX: "hidden",
              }}
            >
              {renderSteps()}
              <div className={isLandscape ? "pb-20" : "pb-24"} />
            </section>
          </div>
        </div>

        {/* 하단 바 */}
        {isLandscape ? (
          <div
            ref={bottomBarRef}
            className="fixed z-[950] bg-black"
            style={{
              left: rightColBox.left,
              width: rightColBox.width,
              bottom: 0,
              opacity: rightColBox.width > 0 ? 1 : 0,
              pointerEvents: rightColBox.width > 0 ? "auto" : "none",
            }}
          >
            <div
              className="mx-auto flex max-w-full items-center justify-center gap-4 px-3 py-3"
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
              {/* ...버튼 동일... */}
              <TimerBottomSheet type="button" recipeId={recipeId} recipeName={recipeName} />

              <div className="flex flex-col items-center gap-1">
                <button
                  className={[
                    "relative flex h-14 w-14 items-center justify-center rounded-full p-2 transition active:scale-95 shadow-[0_2px_16px_rgba(0,0,0,0.32)]",
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
                  {repeatGroup && (
                    <span className="pointer-events-none absolute inset-0 rounded-full animate-[pulse_2.4s_ease-in-out_infinite] shadow-[0_0_0_0_rgba(251,146,60,0.45)]" />
                  )}
                </button>
                <span
                  className={[
                    "text-[10px] font-medium tracking-tight",
                    repeatGroup ? "text-orange-300" : "text-neutral-400",
                  ].join(" ")}
                >
                  {repeatGroup ? "구간 반복 켜짐" : "구간 반복 꺼짐"}
                </span>
              </div>

              <button
                className="relative flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 p-2 shadow-[0_2px_16px_rgba(0,0,0,0.32)] transition active:scale-95"
                onClick={() => setShowVoiceGuide(true)}
                aria-label="음성 명령 가이드"
                type="button"
                title="음성 명령 가이드"
              >
                <img
                  src="/tori-idle.png"
                  alt="토리"
                  className="h-8 w-8 object-contain"
                />
              </button>
            </div>

            <div className="h-6 w-full bg-black" />
          </div>
        ) : (
          <div
            ref={bottomBarRef}
            className="fixed left-0 right-0 z-[1000] flex flex-col items-center bg-black"
            style={{ bottom: 0 }}
          >
            <div
              className="flex w-full items-end justify-between px-5"
              style={{
                paddingTop: 8,
                paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)",
              }}
            >
              <TimerBottomSheet type="button" recipeId={recipeId} recipeName={recipeName} />

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
                >
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
                  {repeatGroup && (
                    <span className="pointer-events-none absolute inset-0 rounded-full animate-[pulse_2.4s_ease-in-out_infinite] shadow-[0_0_0_0_rgba(251,146,60,0.45)]" />
                  )}
                </button>
                <span
                  className={[
                    "text-[10px] font-medium tracking-tight",
                    repeatGroup ? "text-orange-300" : "text-neutral-400",
                  ].join(" ")}
                >
                  {repeatGroup ? "구간 반복 켜짐" : "구간 반복 꺼짐"}
                </span>
              </div>

              <button
                className="relative flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full bg-orange-500 p-2 shadow-[0_2px_16px_rgba(0,0,0,0.32)] transition active:scale-95"
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

            <div className="h-6 w-full bg-black" />
          </div>
        )}
        <VoiceGuide
          isVisible={showVoiceGuide}
          onClose={() => setShowVoiceGuide(false)}
        />
      </div>
    </>
  );
}

/* =====================================================================================
   페이지 래퍼 / 스켈레톤
===================================================================================== */
const RecipeStepPageReady = ({ id }: { id: string }) => {
  const { data } = useFetchRecipe(id);
  const videoInfo = (data as RecipeAPIData | undefined)?.videoInfo ?? {};
  const steps = (data as RecipeAPIData | undefined)?.steps ?? [];

  if (!data || !videoInfo?.id || steps.length === 0) {
    return <RecipeStepPageSkeleton />;
  }

  return <RecipeStep videoInfo={videoInfo} steps={steps} recipeId={id} recipeName={data.videoInfo.videoTitle ?? ""} />;
};

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
        <div className="space-y-3 pt-6">
          <TextSkeleton />
          <TextSkeleton />
          <TextSkeleton />
        </div>
      </div>
    </>
  );
};

export { RecipeStepPageReady, RecipeStepPageSkeleton };
