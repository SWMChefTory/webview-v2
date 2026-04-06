import { useCallback, useEffect, useRef, useState } from "react";

interface UseVadSpeechRecognitionReturn {
  /** 브라우저가 VAD + SpeechRecognition을 지원하는지 여부 */
  isSupported: boolean;
  /** VAD가 활성화되어 음성 감지 중인지 여부 */
  isVadRunning: boolean;
  /** VAD가 현재 음성을 감지했는지 여부 */
  isSpeechDetected: boolean;
  /** 인식된 텍스트 (final 누적 + interim) */
  transcript: string;
  /** VAD 토글 (시작/중지) */
  toggleVad: () => void;
  /** 초기화 에러 메시지 */
  error: string | null;
}

// 동일 origin 스크립트 로딩 (중복 로드 방지)
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _micVADClass: any = null;

/**
 * ONNX Runtime과 vad-web을 public/vad/에서 로드.
 * - ort.min.mjs: ES module로 dynamic import (번들러 우회)
 * - bundle.min.js: UMD 스크립트 (window.ort 의존 → window.vad 등록)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadMicVAD(): Promise<any> {
  if (_micVADClass) return _micVADClass;

  // 1) ONNX Runtime을 ES module로 로드 (dynamic import로 번들러 우회)
  //    /vad/ort.min.mjs 내부의 import('./ort-wasm-simd-threaded.mjs')는
  //    동일 origin이므로 /vad/ort-wasm-simd-threaded.mjs를 정상 resolve
  const ortModuleUrl = new URL("/vad/ort.min.mjs", window.location.origin).href;
  const ort = await import(/* webpackIgnore: true */ ortModuleUrl);

  // 2) WASM 바이너리 경로 설정 (ONNX 초기화 전에 설정해야 함)
  ort.env.wasm.wasmPaths = "/vad/";

  // 3) window.ort 등록 (vad-web UMD 번들이 self.ort를 참조)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).ort = ort;

  // 4) vad-web UMD 번들 로드 → window.vad.MicVAD 등록
  await loadScript("/vad/bundle.min.js");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vadLib = (window as any).vad;
  if (!vadLib?.MicVAD) {
    throw new Error("Failed to load VAD library");
  }

  _micVADClass = vadLib.MicVAD;
  return _micVADClass;
}

export function useVadSpeechRecognition(
  lang: string = "ko-KR"
): UseVadSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isVadRunning, setIsVadRunning] = useState(false);
  const [isSpeechDetected, setIsSpeechDetected] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vadInstanceRef = useRef<any>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");
  const isSpeechDetectedRef = useRef(false);
  const isVadRunningRef = useRef(false);

  // 브라우저 지원 여부 확인 (hydration mismatch 방지)
  useEffect(() => {
    const hasSpeechRecognition = !!(
      window.SpeechRecognition || window.webkitSpeechRecognition
    );
    const hasWasm = typeof WebAssembly !== "undefined";
    setIsSupported(hasSpeechRecognition && hasWasm);
  }, []);

  // SpeechRecognition 인스턴스 생성 (시작하지 않음)
  const initRecognition = useCallback(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return null;

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentInterim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript + " ";
        } else {
          currentInterim += result[0].transcript;
        }
      }

      setTranscript((finalTranscriptRef.current + currentInterim).trim());
    };

    recognition.onerror = (event: { error: string }) => {
      if (event.error === "aborted" || event.error === "no-speech") return;
      console.warn("[VadSpeech] recognition error:", event.error);
    };

    recognition.onend = () => {
      // VAD가 켜져 있으면 recognition 자동 재시작 (Web Speech는 항상 활성)
      if (isVadRunningRef.current) {
        try {
          recognition.start();
        } catch {
          // 이미 시작됨 - 무시
        }
      }
    };

    return recognition;
  }, [lang]);

  // VAD 시작
  const startVad = useCallback(async () => {
    try {
      const MicVAD = await loadMicVAD();

      const recognition = initRecognition();
      recognitionRef.current = recognition;

      const vadInstance = await MicVAD.new({
        baseAssetPath: "/vad/",
        onnxWASMBasePath: "/vad/",
        positiveSpeechThreshold: 0.6,
        negativeSpeechThreshold: 0.35,
        minSpeechMs: 150,
        redemptionMs: 300,

        onSpeechStart: () => {
          isSpeechDetectedRef.current = true;
          setIsSpeechDetected(true);
          // Web Speech API는 이미 실행 중 — 시각 피드백만 전환
        },

        onSpeechEnd: () => {
          isSpeechDetectedRef.current = false;
          setIsSpeechDetected(false);
          // Web Speech API는 계속 실행 — 시각 피드백만 전환
        },
      });

      vadInstanceRef.current = vadInstance;
      vadInstance.start();
      isVadRunningRef.current = true;
      setIsVadRunning(true);
      setError(null);
      finalTranscriptRef.current = "";
      setTranscript("");

      // Web Speech API도 함께 시작 (VAD와 병렬 실행)
      if (recognition) {
        try {
          recognition.start();
        } catch {
          // 이미 실행 중 - 무시
        }
      }
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "VAD initialization failed";
      console.error("[VadSpeech] init failed:", e);
      setError(message);
    }
  }, [initRecognition]);

  // VAD 중지
  const stopVad = useCallback(() => {
    if (vadInstanceRef.current) {
      vadInstanceRef.current.pause();
      vadInstanceRef.current.destroy?.();
      vadInstanceRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // 시작되지 않음 - 무시
      }
      recognitionRef.current = null;
    }

    isVadRunningRef.current = false;
    isSpeechDetectedRef.current = false;
    setIsVadRunning(false);
    setIsSpeechDetected(false);
    setTranscript("");
    finalTranscriptRef.current = "";
  }, []);

  // 토글
  const toggleVad = useCallback(() => {
    if (isVadRunningRef.current) {
      stopVad();
    } else {
      startVad();
    }
  }, [startVad, stopVad]);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopVad();
    };
  }, [stopVad]);

  return {
    isSupported,
    isVadRunning,
    isSpeechDetected,
    transcript,
    toggleVad,
    error,
  };
}
