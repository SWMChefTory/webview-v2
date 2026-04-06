import { useState, useRef, useCallback, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _embeddingPipeline: Promise<any> | null = null;

async function getEmbedder() {
  if (!_embeddingPipeline) {
    _embeddingPipeline = (async () => {
      const { pipeline } = await import("@huggingface/transformers");
      // env 전역 설정 건드리지 않음 — HuggingFace CDN에서 다운로드
      return pipeline(
        "feature-extraction",
        "Xenova/paraphrase-multilingual-MiniLM-L12-v2",
        { device: "wasm", dtype: "q8" }
      );
    })();
  }
  return _embeddingPipeline;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export interface SceneMatchResult {
  index: number;
  score: number;
  label: string;
}

export function useSceneMatcher(sceneLabels: string[]) {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const sceneEmbeddingsRef = useRef<number[][] | null>(null);
  const embeddedLabelsRef = useRef<string>("");

  // 장면 라벨이 바뀌면 임베딩 초기화
  const labelsKey = sceneLabels.join("|");
  useEffect(() => {
    if (embeddedLabelsRef.current !== labelsKey) {
      sceneEmbeddingsRef.current = null;
      setIsReady(false);
    }
  }, [labelsKey]);

  // 모델 로드 + 장면 라벨 임베딩
  const embedScenes = useCallback(async () => {
    // 이미 현재 라벨 set이 임베딩됨
    if (embeddedLabelsRef.current === labelsKey && sceneEmbeddingsRef.current) {
      return;
    }

    setIsLoading(true);
    try {
      const embedScenesStart = performance.now();
      const embedder = await getEmbedder();
      const modelLoadLatency = performance.now() - embedScenesStart;
      console.log(`⏱️ [Latency] Embedding model load: ${modelLoadLatency.toFixed(0)}ms`);

      const embeddings: number[][] = [];

      for (let i = 0; i < sceneLabels.length; i++) {
        // "장면N. label" 형태로 임베딩 (음성 명령 "장면1", "장면2" 매칭 향상)
        const labelWithPrefix = `장면${i + 1}. ${sceneLabels[i]}`;
        const output = await embedder(labelWithPrefix, {
          pooling: "mean",
          normalize: true,
        });
        embeddings.push(Array.from(output.data as Float32Array));
      }

      const totalLatency = performance.now() - embedScenesStart;
      sceneEmbeddingsRef.current = embeddings;
      embeddedLabelsRef.current = labelsKey;
      setIsReady(true);
      console.log(
        `⏱️ [Latency] Scene embedding: ${totalLatency.toFixed(0)}ms (${sceneLabels.length} scenes)`,
        sceneLabels
      );
    } catch (e) {
      console.error("[SceneMatcher] Embedding failed:", e);
      _embeddingPipeline = null; // 재시도 가능하도록
    } finally {
      setIsLoading(false);
    }
  }, [sceneLabels, labelsKey]);

  // 유저 입력과 가장 유사한 장면 찾기
  const findBestScene = useCallback(
    async (userText: string): Promise<SceneMatchResult | null> => {
      // 아직 임베딩 안됐으면 먼저 임베딩
      if (!sceneEmbeddingsRef.current) {
        await embedScenes();
      }
      if (!sceneEmbeddingsRef.current || sceneEmbeddingsRef.current.length === 0) {
        return null;
      }

      try {
        const embedStart = performance.now();
        const embedder = await getEmbedder();
        const queryOutput = await embedder(userText, {
          pooling: "mean",
          normalize: true,
        });
        const queryVec = Array.from(queryOutput.data as Float32Array);

        let bestIdx = 0;
        let bestScore = -1;

        for (let i = 0; i < sceneEmbeddingsRef.current.length; i++) {
          const score = cosineSimilarity(queryVec, sceneEmbeddingsRef.current[i]);
          if (score > bestScore) {
            bestScore = score;
            bestIdx = i;
          }
        }

        const result = {
          index: bestIdx,
          score: bestScore,
          label: sceneLabels[bestIdx],
        };

        const embedLatency = performance.now() - embedStart;
        console.log(
          `⏱️ [Latency] Embedding: ${embedLatency.toFixed(0)}ms → "${result.label}" (${(result.score * 100).toFixed(1)}%) text="${userText}"`
        );

        return result;
      } catch (e) {
        console.error("[SceneMatcher] Match failed:", e);
        return null;
      }
    },
    [embedScenes, sceneLabels]
  );

  return { findBestScene, embedScenes, isLoading, isReady };
}
