import { useState, useRef, useCallback } from "react";

const INTENT_LABELS = [
  "NEXT_STEP",
  "PREV_STEP",
  "GO_TO_STEP",
  "PLAY",
  "PAUSE",
  "EXTRA",
] as const;

export type IntentLabel = (typeof INTENT_LABELS)[number];

export interface ClassificationResult {
  intent: IntentLabel;
  confidence: number;
  allScores: Record<IntentLabel, number>;
}

// 싱글턴 pipeline (여러 컴포넌트에서 재사용)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _pipelinePromise: Promise<any> | null = null;

async function getClassifier() {
  if (!_pipelinePromise) {
    _pipelinePromise = (async () => {
      const { pipeline, env } = await import("@huggingface/transformers");
      // 브라우저 기본값이 allowLocalModels=false일 수 있으므로 명시적으로 true
      env.allowLocalModels = true;
      return pipeline("text-classification", "/nlu", {
        local_files_only: true,
        device: "wasm",
      });
    })();
  }
  return _pipelinePromise;
}

export function useIntentClassifier() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const readyRef = useRef(false);

  const loadModel = useCallback(async () => {
    if (readyRef.current || isLoading) return;
    try {
      setIsLoading(true);
      setError(null);
      const loadStart = performance.now();
      await getClassifier();
      readyRef.current = true;
      console.log(`⏱️ [Latency] NLU model load: ${(performance.now() - loadStart).toFixed(0)}ms`);
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      console.error("[IntentClassifier] Load failed:", err);
      setError(err);
      _pipelinePromise = null; // 재시도 가능하도록
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const classify = useCallback(
    async (text: string): Promise<ClassificationResult | null> => {
      if (!readyRef.current) return null;

      try {
        const nluStart = performance.now();
        const classifier = await getClassifier();
        // top_k: 모든 라벨의 점수를 반환
        const outputs = await classifier(text, {
          top_k: INTENT_LABELS.length,
        });
        const nluLatency = performance.now() - nluStart;

        // outputs: Array<{ label: string, score: number }>
        const allScores = {} as Record<IntentLabel, number>;
        let topIntent: IntentLabel = "EXTRA";
        let topScore = 0;

        for (const item of outputs) {
          const label = item.label as IntentLabel;
          allScores[label] = item.score;
          if (item.score > topScore) {
            topScore = item.score;
            topIntent = label;
          }
        }

        // 빠진 라벨 0으로 채우기
        for (const label of INTENT_LABELS) {
          if (!(label in allScores)) allScores[label] = 0;
        }

        const result: ClassificationResult = {
          intent: topIntent,
          confidence: topScore,
          allScores,
        };

        console.log(
          `⏱️ [Latency] NLU: ${nluLatency.toFixed(0)}ms → ${result.intent} (${(result.confidence * 100).toFixed(1)}%) text="${text}"`
        );

        return result;
      } catch (e) {
        console.error("[IntentClassifier] classify error:", e);
        return null;
      }
    },
    []
  );

  return { classify, loadModel, isLoading, error };
}
