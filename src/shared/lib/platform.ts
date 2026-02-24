/**
 * 플랫폼 감지 유틸리티
 * Window.ReactNativeWebView 타입은 src/shared/client/native/client.ts에서 global 선언됨
 */

/** 모바일 앱(ReactNativeWebView) 환경인지 확인 */
export const isNativeApp = (): boolean =>
  typeof window !== "undefined" && !!window.ReactNativeWebView;

/** 웹 브라우저 환경인지 확인 */
export const isWebBrowser = (): boolean =>
  typeof window !== "undefined" && !window.ReactNativeWebView;
