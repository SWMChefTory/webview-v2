import { useCallback, useEffect, useRef, useState } from "react";

interface PocSpeechParams {
  lang?: string;
  /** final transcript 생성 시 콜백 (intent 분류용) */
  onFinalResult?: (text: string) => void;
}

export function usePocSpeech({
  lang = "ko-KR",
  onFinalResult,
}: PocSpeechParams) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [recordingCount, setRecordingCount] = useState(0); // 녹음 횟수

  // refs
  const isListeningRef = useRef(false);

  // Audio recording
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Web Speech API
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const recognitionActiveRef = useRef(false);

  // Latency 측정
  const sttStartRef = useRef(0);

  // 최신 콜백
  const onFinalResultRef = useRef(onFinalResult);
  useEffect(() => {
    onFinalResultRef.current = onFinalResult;
  }, [onFinalResult]);

  // -----------------------------------
  // Web Speech API 초기화 (한 번만)
  // -----------------------------------
  useEffect(() => {
    const SpeechRecognitionCtor =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognitionCtor) {
      console.warn("[PocSpeech] SpeechRecognition 미지원");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      setTranscript(interimText || finalText);

      if (finalText.trim()) {
        const sttEndTime = performance.now();
        const sttStartTime = sttStartRef.current;
        const sttLatency = sttStartTime > 0 ? sttEndTime - sttStartTime : 0;
        console.log(
          `⏱️ [Latency] STT: ${sttLatency.toFixed(0)}ms text="${finalText.trim()}"`
        );
        // sttStartRef 리셋 → 다음 utterance 측정 준비
        sttStartRef.current = performance.now();
        onFinalResultRef.current?.(finalText.trim());
      }
    };

    recognition.onerror = (event: { error: string }) => {
      console.log("[PocSpeech] SpeechRecognition error:", event.error);
      if (event.error === "aborted" || event.error === "no-speech") return;
      recognitionActiveRef.current = false;
    };

    recognition.onend = () => {
      recognitionActiveRef.current = false;
      // listening 중이면 자동 재시작
      if (isListeningRef.current) {
        try {
          recognition.start();
          recognitionActiveRef.current = true;
        } catch {
          // 이미 시작됨
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch {}
      recognitionRef.current = null;
      recognitionActiveRef.current = false;
    };
  }, [lang]);

  // -----------------------------------
  // 녹음 파일 저장
  // -----------------------------------
  /** 마이크 스트림 정리 */
  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      for (const t of streamRef.current.getTracks()) t.stop();
      streamRef.current = null;
      console.log("[PocSpeech] 마이크 스트림 해제");
    }
  }, []);

  const saveRecording = useCallback(async (chunks: Blob[]) => {
    console.log(`[PocSpeech] saveRecording 호출 - chunks: ${chunks.length}개`);

    if (chunks.length === 0) {
      console.log("[PocSpeech] 녹음 데이터 없음, 스트림만 정리");
      cleanupStream();
      return;
    }

    const blob = new Blob(chunks, { type: "audio/webm;codecs=opus" });
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
    const filename = `poc_recording_${timestamp}.webm`;
    const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
    console.log(`[PocSpeech] Blob 생성: ${filename} (${sizeMB}MB, ${blob.size} bytes)`);

    // WebView 환경: postMessage로 base64 전송 (네이티브 프로토콜 형식)
    if (window.ReactNativeWebView) {
      try {
        const arrayBuffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        console.log(`[PocSpeech] arrayBuffer 변환 완료: ${bytes.length} bytes`);

        // 청크 단위로 변환 (큰 파일 메모리 방지)
        const CHUNK = 8192;
        let binary = "";
        for (let i = 0; i < bytes.length; i += CHUNK) {
          const slice = bytes.subarray(i, i + CHUNK);
          binary += String.fromCharCode(...slice);
        }
        const base64 = btoa(binary);
        console.log(`[PocSpeech] base64 변환 완료: ${base64.length} chars`);

        const message = JSON.stringify({
          intended: true,
          action: "REQUEST",
          mode: "UNBLOCKING",
          type: "SAVE_AUDIO",
          payload: {
            filename,
            mimeType: "audio/webm",
            base64,
            size: blob.size,
          },
        });
        window.ReactNativeWebView.postMessage(message);
        console.log(`[PocSpeech] ✅ postMessage 전송 완료: ${filename} (${sizeMB}MB)`);
      } catch (e) {
        console.error("[PocSpeech] ❌ base64 변환/전송 실패:", e);
      }
    } else {
      // 브라우저 환경: 다운로드 트리거
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      console.log(`[PocSpeech] ✅ 녹음 다운로드: ${filename} (${sizeMB}MB)`);
    }

    // ★ 저장 완료 후 스트림 정리 (race condition 해결)
    cleanupStream();
  }, [cleanupStream]);

  // -----------------------------------
  // 토글 (마이크 버튼)
  // -----------------------------------
  const toggleListening = useCallback(async () => {
    if (isListeningRef.current) {
      // ─── 정지 ───
      isListeningRef.current = false;
      setIsListening(false);

      // 1) Web Speech API 정지
      if (recognitionRef.current && recognitionActiveRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionActiveRef.current = false;
      }

      // 2) MediaRecorder 정지 → onstop에서 saveRecording → 스트림 정리
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        console.log("[PocSpeech] MediaRecorder 정지 요청 (onstop에서 저장+스트림정리)");
        recorderRef.current.stop();
      } else {
        // recorder가 없거나 이미 inactive면 스트림만 직접 정리
        cleanupStream();
      }

      console.log("[PocSpeech] 중지");
    } else {
      // ─── 시작 ───
      try {
        setError(null);
        setTranscript("");

        // 1) 마이크 오픈 (AEC 활성화)
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true, // ★ AEC
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        });
        streamRef.current = stream;

        // 2) MediaRecorder 설정
        chunksRef.current = [];
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm";

        const recorder = new MediaRecorder(stream, { mimeType });
        recorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
            console.log(`[PocSpeech] 청크 수집: ${e.data.size} bytes (총 ${chunksRef.current.length}개)`);
          }
        };

        recorder.onstop = () => {
          // ★ 녹음 종료 → 파일 저장 (스트림 정리는 saveRecording 내부에서)
          console.log(`[PocSpeech] recorder.onstop 발생 - 청크 ${chunksRef.current.length}개`);
          const chunks = [...chunksRef.current]; // 복사본 사용
          chunksRef.current = [];
          saveRecording(chunks);
          setRecordingCount((c) => c + 1);
        };

        // 1초마다 청크 수집 (안정성)
        recorder.start(1000);
        console.log("[PocSpeech] 녹음 시작 (AEC ON, format:", mimeType, ")");

        // 3) Web Speech API 시작
        sttStartRef.current = performance.now(); // STT 시작 시간 기록
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
            recognitionActiveRef.current = true;
          } catch {}
        }

        isListeningRef.current = true;
        setIsListening(true);
        console.log("[PocSpeech] 시작 (녹음 + Web Speech)");
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "마이크 초기화 실패";
        console.error("[PocSpeech] 초기화 실패:", e);
        setError(msg);
      }
    }
  }, [saveRecording, cleanupStream]);

  // -----------------------------------
  // 클린업
  // -----------------------------------
  useEffect(() => {
    return () => {
      isListeningRef.current = false;

      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        try {
          recorderRef.current.stop();
        } catch {}
        recorderRef.current = null;
      }
      if (streamRef.current) {
        for (const t of streamRef.current.getTracks()) t.stop();
        streamRef.current = null;
      }
    };
  }, []);

  return {
    isListening,
    isSpeechDetected: isListening, // VAD 없으므로 listening과 동일
    transcript,
    error,
    toggleListening,
    recordingCount,
  };
}
