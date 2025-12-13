// hooks/useSlideRouter.ts
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export const useSlideRouter = () => {
  const router = useRouter();

  // 1. 페이지 이동 함수 (Push)
  const push = useCallback((url: string) => {
    // View Transition을 지원하지 않으면 그냥 이동
    if (!document.startViewTransition) {
      router.push(url);
      return;
    }

    document.documentElement.setAttribute('data-slide', 'next');
    document.startViewTransition(async () => {
      await router.push(url);
    });
  }, [router]);

  const back = useCallback(() => {
    if (!document.startViewTransition) {
      router.back();
      return;
    }

    // "이전" 방향 설정
    document.documentElement.setAttribute('data-slide', 'prev');
    document.startViewTransition(async () => {
      router.back();
      // 참고: router.back()은 Promise를 반환하지 않아서
      // 타이밍이 미세하게 안 맞을 수 있지만 대부분 작동합니다.
    });
  }, [router]);

  return { push, back };
};