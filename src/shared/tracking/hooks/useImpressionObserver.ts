import { useRef, useEffect, useCallback } from 'react';
import type { SurfaceType, ImpressionItem } from '../model/types';
import { sendImpressions, flushImpressions } from '../api/trackingApi';

interface UseImpressionObserverOptions {
  requestId: string;
  surfaceType: SurfaceType;
  debounceMs?: number;
  threshold?: number;
}

export function useImpressionObserver({
  requestId,
  surfaceType,
  debounceMs = 1000,
  threshold = 0.5,
}: UseImpressionObserverOptions) {
  const observer = useRef<IntersectionObserver | null>(null);
  const elementMeta = useRef<Map<Element, { recipeId: string; position: number }>>(new Map());
  const impressedSet = useRef<Set<string>>(new Set());
  const buffer = useRef<ImpressionItem[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // recipeId → Element 역참조 (unobserve용)
  const recipeElementMap = useRef<Map<string, Element>>(new Map());

  // 최신 requestId/surfaceType을 항상 참조하기 위한 refs (stale closure 방지)
  const requestIdRef = useRef(requestId);
  const surfaceTypeRef = useRef(surfaceType);

  // requestId/surfaceType 변경 시: 이전 세션 flush + impressedSet 초기화
  useEffect(() => {
    if (requestIdRef.current !== requestId || surfaceTypeRef.current !== surfaceType) {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      // 이전 세션의 잔여 버퍼를 이전 requestId로 flush
      if (buffer.current.length > 0) {
        const items = buffer.current.splice(0);
        flushImpressions({
          requestId: requestIdRef.current,
          surfaceType: surfaceTypeRef.current,
          impressions: items,
        });
      }
      impressedSet.current.clear();
    }
    requestIdRef.current = requestId;
    surfaceTypeRef.current = surfaceType;
  }, [requestId, surfaceType]);

  // IntersectionObserver 초기화 (한 번만 — refs로 최신 값 참조)
  useEffect(() => {
    const bufferCurrent = buffer.current;
    const elementMetaCurrent = elementMeta.current;
    const recipeElementMapCurrent = recipeElementMap.current;

    observer.current = new IntersectionObserver(
      (entries) => {
        let changed = false;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const meta = elementMetaCurrent.get(entry.target);
          if (!meta) continue;
          if (impressedSet.current.has(meta.recipeId)) continue;

          impressedSet.current.add(meta.recipeId);
          bufferCurrent.push({
            recipeId: meta.recipeId,
            position: meta.position,
            timestamp: Date.now(),
          });
          changed = true;
        }
        if (changed) {
          if (timerRef.current !== null) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            if (bufferCurrent.length === 0) return;
            const items = bufferCurrent.splice(0);
            sendImpressions({
              requestId: requestIdRef.current,
              surfaceType: surfaceTypeRef.current,
              impressions: items,
            });
          }, debounceMs);
        }
      },
      { threshold }
    );

    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      if (bufferCurrent.length > 0) {
        const items = bufferCurrent.splice(0);
        flushImpressions({
          requestId: requestIdRef.current,
          surfaceType: surfaceTypeRef.current,
          impressions: items,
        });
      }
      observer.current?.disconnect();
      observer.current = null;
      elementMetaCurrent.clear();
      recipeElementMapCurrent.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // visibilitychange: 탭 이탈 시 잔여 버퍼 flush
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        if (buffer.current.length > 0) {
          const items = buffer.current.splice(0);
          flushImpressions({
            requestId: requestIdRef.current,
            surfaceType: surfaceTypeRef.current,
            impressions: items,
          });
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const observeRef = useCallback(
    (node: HTMLElement | null, recipeId: string, position: number) => {
      if (node) {
        elementMeta.current.set(node, { recipeId, position });
        recipeElementMap.current.set(recipeId, node);
        observer.current?.observe(node);
      } else {
        // 언마운트: 역참조로 이전 element 찾아서 정리
        const prevEl = recipeElementMap.current.get(recipeId);
        if (prevEl) {
          observer.current?.unobserve(prevEl);
          elementMeta.current.delete(prevEl);
          recipeElementMap.current.delete(recipeId);
        }
      }
    },
    []
  );

  return { observeRef, impressedSet };
}
