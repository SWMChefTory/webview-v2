/**
 * 반응형 디자인 Breakpoint 상수
 *
 * Tailwind CSS 기본 breakpoint 기준:
 * - Mobile: 0 ~ 767px (prefix 없음)
 * - Tablet: 768px ~ 1023px (md: prefix)
 * - Desktop: 1024px ~ (lg: prefix)
 */

/**
 * Breakpoint 픽셀 값
 */
export const BREAKPOINTS = {
  /** 모바일 최대 너비 (767px) */
  mobile: 767,
  /** 태블릿 최소 너비 (768px) */
  tablet: 768,
  /** 태블릿 최대 너비 (1023px) */
  tabletMax: 1023,
  /** 데스크탑 최소 너비 (1024px) */
  desktop: 1024,
} as const;

/**
 * 미디어 쿼리 문자열
 */
export const MEDIA_QUERIES = {
  /** 모바일 전용: ~767px */
  mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
  /** 태블릿 전용: 768px ~ 1023px */
  tablet: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.tabletMax}px)`,
  /** 태블릿 이상: 768px ~ */
  tabletUp: `(min-width: ${BREAKPOINTS.tablet}px)`,
  /** 데스크탑 전용: 1024px ~ */
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
} as const;

/**
 * 디바이스 타입
 */
export type DeviceType = "mobile" | "tablet" | "desktop";

/**
 * 현재 breakpoint 기준 디바이스 타입 반환 (SSR 안전)
 *
 * @returns 현재 디바이스 타입
 */
export function getDeviceType(): DeviceType {
  if (typeof window === "undefined") return "mobile"; // SSR 기본값

  const width = window.innerWidth;

  if (width <= BREAKPOINTS.mobile) return "mobile";
  if (width <= BREAKPOINTS.tabletMax) return "tablet";
  return "desktop";
}
