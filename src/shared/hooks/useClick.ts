import { useRef, useEffect } from "react";

export const useResolveLongClick = (
  onClick: () => void,
  onClickLong?: () => void
) => {
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);

  const curPoint = useRef<{ x: number; y: number } | null>(null);
  // 마우스 이동 경로 추적
  const trackPoint = useRef(({ x, y }: { x: number; y: number }) => {
    curPoint.current = { x, y };
  });

  //클릭 중 기준 보다 많이 이동되었는지 체크.
  const checkClickCallable = () => {
    if (startPoint.current === null) {
      return false;
    }
    if (
      curPoint.current === null ||
      (Math.abs(curPoint.current.x - startPoint.current.x) < 1 &&
        Math.abs(curPoint.current.y - startPoint.current.y) < 1)
    ) {
      return true;
    }
    return false;
  };

  const pointerUpCallback = useRef(() => {
    if (timer.current && checkClickCallable()) {
        console.log("click");
      onClick();
    }
    console.log("클리어 이벤트 호출");
    clearClickEvent();
  });

  const clearClickEvent = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
    window.removeEventListener("pointermove", trackPoint.current);
    startPoint.current = null;
    curPoint.current = null;
    window.removeEventListener("pointerup", pointerUpCallback.current);
  };

  useEffect(() => {
    return () => {
      clearClickEvent();
    };
  }, []);

  const handleTapStart = (event: PointerEvent) => {
    if (timer.current) {
      return;
    }
    startPoint.current = { x: event.clientX, y: event.clientY };

    window.addEventListener("pointermove", trackPoint.current, { once: true });
    window.addEventListener("pointerup", pointerUpCallback.current, {
      once: true,
    });
    timer.current = setTimeout(async () => {
      if (checkClickCallable()) {
        onClickLong?.();
      }
      clearClickEvent();
    }, 1000);
  };

  return { handleTapStart };
};
