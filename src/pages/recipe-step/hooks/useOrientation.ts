import { useEffect, useRef, useState } from "react";

export type Orientation = "portrait" | "landscape-left" | "landscape-right";

const getOrientationFromAngle = (angle: number): Orientation => {
  if (angle === 90) return "landscape-right";
  if (angle === 270 || angle === -90) return "landscape-left";
  return "portrait";
};

export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>("portrait");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateOrientation = () => {
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;
      if (!isLandscape) {
        setOrientation("portrait");
        return;
      }

      if (screen.orientation?.angle !== undefined) {
        setOrientation(getOrientationFromAngle(screen.orientation.angle));
        return;
      }

      const windowOrientation = (window as any).orientation;
      if (windowOrientation !== undefined) {
        setOrientation(getOrientationFromAngle(windowOrientation));
        return;
      }

      // 최종 폴백: 뷰포트 크기로만 판단 (좌우 구분 불가)
      setOrientation("landscape-right");
    };

    updateOrientation();

    window.addEventListener("orientationchange", updateOrientation);
    window.addEventListener("resize", updateOrientation);
    screen.orientation?.addEventListener("change", updateOrientation);

    return () => {
      window.removeEventListener("orientationchange", updateOrientation);
      window.removeEventListener("resize", updateOrientation);
      screen.orientation?.removeEventListener("change", updateOrientation);
    };
  }, []);

  return orientation;
}

export function useIsRotating() {
  const [isRotating, setIsRotating] = useState(false);
  const rotateTimerRef = useRef<number | null>(null);

  //orientationChange를 왜 알필요가 있지?
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
  });

  return isRotating;
}
