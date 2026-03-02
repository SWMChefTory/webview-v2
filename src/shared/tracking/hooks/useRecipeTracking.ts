import { useState, useEffect, useCallback } from 'react';
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
          requestId,
          surfaceType,
          impressions: [{ recipeId, position, timestamp }],
        });
        impressedSet.current.add(recipeId);
      }

      sendClick({ requestId, surfaceType, recipeId, position, timestamp });
    },
    [requestId, surfaceType, impressedSet]
  );

  return { requestId, observeRef, trackClick };
}
