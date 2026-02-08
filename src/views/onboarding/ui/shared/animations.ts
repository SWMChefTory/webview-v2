import type { Transition } from "motion/react";
import { ANIMATION } from "./constants";

// 슬라이드 애니메이션 variants 커스텀 타입
interface SlideCustom {
  direction: number;
  shouldAnimate: boolean;
}

// 슬라이드 X variants (Step 1, 2 공통)
export const slideXVariants = {
  hidden: (custom: SlideCustom) => ({
    opacity: custom.shouldAnimate ? 0 : 1,
    x: custom.shouldAnimate
      ? (custom.direction > 0 ? ANIMATION.SLIDE_OFFSET : -ANIMATION.SLIDE_OFFSET)
      : 0,
  }),
  visible: { opacity: 1, x: 0 },
  exit: (custom: SlideCustom) => ({
    opacity: custom.shouldAnimate ? 0 : 1,
    x: custom.shouldAnimate
      ? (custom.direction > 0 ? -ANIMATION.SLIDE_OFFSET : ANIMATION.SLIDE_OFFSET)
      : 0,
  }),
};

// 애니메이션 transition 설정 생성
export const createSlideTransition = (
  shouldAnimate: boolean
): Transition => ({
  duration: shouldAnimate ? ANIMATION.DURATION_SEC : 0,
  ease: shouldAnimate ? ANIMATION.EASE : undefined,
});

// fadeInUp variants (Step 3에서 사용)
export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

