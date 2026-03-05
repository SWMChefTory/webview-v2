import { useState, useEffect, useCallback, useRef } from 'react';
import type { SurfaceType, RecipeTrackingReturn, RecipeTrackingOptions } from '../model/types';
import { sendImpressions, sendClick } from '../api/trackingApi';
import { useImpressionObserver } from './useImpressionObserver';

export function useRecipeTracking(
  surfaceType: SurfaceType,
  options?: RecipeTrackingOptions
): RecipeTrackingReturn {
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    setRequestId(crypto.randomUUID());
  }, [options?.resetKey]);

  const requestIdRef = useRef(requestId);
  const surfaceTypeRef = useRef(surfaceType);
  useEffect(() => {
    requestIdRef.current = requestId;
    surfaceTypeRef.current = surfaceType;
  }, [requestId, surfaceType]);

  const { observeRef, impressedSet } = useImpressionObserver({
    requestId,
    surfaceType,
    debounceMs: options?.debounceMs,
    threshold: options?.threshold,
  });

  const trackClick = useCallback(
    (recipeId: string, position: number) => {
      const timestamp = Date.now();

      if (!impressedSet.current.has(recipeId)) {
        sendImpressions({
          requestId: requestIdRef.current,
          surfaceType: surfaceTypeRef.current,
          impressions: [{ recipeId, position, timestamp }],
        });
        impressedSet.current.add(recipeId);
      }

      sendClick({ requestId: requestIdRef.current, surfaceType: surfaceTypeRef.current, recipeId, position, timestamp });
    },
    [impressedSet]
  );

  return { requestId, observeRef, trackClick };
}
