/**
 * NativeStepPage – 네이티브 RecipeStepScreen의 WebView에 로드되는 페이지
 *
 * 역할:
 * 1. YouTube iframe 재생 (videoId를 query param으로 받음)
 * 2. getUserMedia(echoCancellation:true) → PCM 청크 → postMessage로 네이티브 전송
 * 3. 네이티브에서 seekTo/play/pause 명령 수신 → YouTube 제어
 *
 * UI는 없음. 네이티브가 모든 UI를 담당.
 */
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

const ReactYouTube = dynamic(() => import("react-youtube"), { ssr: false });

// ─── PCM 녹음 설정 ───
const SAMPLE_RATE = 16000;
const CHUNK_DURATION_MS = 100; // 100ms마다 청크 전송
const CHUNK_SIZE = Math.floor(SAMPLE_RATE * (CHUNK_DURATION_MS / 1000));

// ─── AudioWorklet 프로세서 코드 (inline) ───
const WORKLET_PROCESSOR = `
class PcmChunkProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = new Float32Array(0);
    this._chunkSize = ${CHUNK_SIZE};
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channelData = input[0];

    // 버퍼에 추가
    const newBuffer = new Float32Array(this._buffer.length + channelData.length);
    newBuffer.set(this._buffer);
    newBuffer.set(channelData, this._buffer.length);
    this._buffer = newBuffer;

    // 청크 단위로 전송
    while (this._buffer.length >= this._chunkSize) {
      const chunk = this._buffer.slice(0, this._chunkSize);
      this._buffer = this._buffer.slice(this._chunkSize);

      // Float32 → Int16 변환
      const int16 = new Int16Array(chunk.length);
      for (let i = 0; i < chunk.length; i++) {
        const s = Math.max(-1, Math.min(1, chunk[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      // base64 인코딩
      const bytes = new Uint8Array(int16.buffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }

      this.port.postMessage({ type: 'pcm_chunk', base64: btoa(binary) });
    }

    return true;
  }
}

registerProcessor('pcm-chunk-processor', PcmChunkProcessor);
`;

export default function NativeStepPage() {
  const router = useRouter();
  const { videoId, startTime } = router.query;

  const ytRef = useRef<YT.Player | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Audio recording refs
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const isRecordingRef = useRef(false);

  // ─── postMessage to native ───
  const postToNative = useCallback((message: object) => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
  }, []);

  // ─── YouTube 제어 ───
  const handlePlayerReady = useCallback(
    (e: { target: YT.Player }) => {
      ytRef.current = e.target;
      setIsReady(true);

      // 시작 시간이 있으면 seek
      if (startTime) {
        const sec = Number(startTime);
        if (!isNaN(sec)) {
          e.target.seekTo(sec, true);
        }
      }

      postToNative({ type: "YOUTUBE_READY" });
    },
    [startTime, postToNative],
  );

  const handlePlayerStateChange = useCallback(
    (e: { data: number }) => {
      // 0=ended, 1=playing, 2=paused, 3=buffering
      postToNative({
        type: "YOUTUBE_STATE",
        state: e.data,
        currentTime: ytRef.current?.getCurrentTime?.() ?? 0,
      });
    },
    [postToNative],
  );

  const opts = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 0,
        rel: 0,
        controls: 0,
        modestbranding: 1,
        playsinline: 1,
        start: startTime ? Math.floor(Number(startTime)) : 0,
      },
    }),
    [startTime],
  );

  // ─── AEC 녹음 시작/중지 ───
  const startRecording = useCallback(async () => {
    if (isRecordingRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: SAMPLE_RATE,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      streamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });

      // AudioWorklet 등록 (inline blob)
      const blob = new Blob([WORKLET_PROCESSOR], {
        type: "application/javascript",
      });
      const url = URL.createObjectURL(blob);
      await audioContext.audioWorklet.addModule(url);
      URL.revokeObjectURL(url);

      const source = audioContext.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(
        audioContext,
        "pcm-chunk-processor",
      );

      // Worklet → postMessage → native
      workletNode.port.onmessage = (e) => {
        if (e.data.type === "pcm_chunk") {
          postToNative({
            type: "PCM_CHUNK",
            base64: e.data.base64,
            sampleRate: SAMPLE_RATE,
          });
        }
      };

      source.connect(workletNode);
      workletNode.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      workletNodeRef.current = workletNode;
      isRecordingRef.current = true;

      postToNative({ type: "RECORDING_STARTED" });
      console.log("[NativeStep] Recording started (AEC ON)");
    } catch (e) {
      console.error("[NativeStep] Recording failed:", e);
      postToNative({
        type: "RECORDING_ERROR",
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }, [postToNative]);

  const stopRecording = useCallback(() => {
    if (!isRecordingRef.current) return;

    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }

    isRecordingRef.current = false;
    postToNative({ type: "RECORDING_STOPPED" });
    console.log("[NativeStep] Recording stopped");
  }, [postToNative]);

  // ─── 네이티브 → 웹뷰 명령 수신 ───
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      let data: { type: string; time?: number };
      try {
        data =
          typeof event.data === "string"
            ? JSON.parse(event.data)
            : event.data;
      } catch {
        return;
      }

      switch (data.type) {
        case "SEEK_TO":
          if (data.time !== undefined) {
            ytRef.current?.seekTo(data.time, true);
          }
          break;
        case "PLAY":
          ytRef.current?.playVideo();
          break;
        case "PAUSE":
          ytRef.current?.pauseVideo();
          break;
        case "START_RECORDING":
          startRecording();
          break;
        case "STOP_RECORDING":
          stopRecording();
          break;
        case "GET_CURRENT_TIME":
          postToNative({
            type: "CURRENT_TIME",
            currentTime: ytRef.current?.getCurrentTime?.() ?? 0,
          });
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [startRecording, stopRecording, postToNative]);

  // ─── 클린업 ───
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  if (!videoId) {
    return <div style={{ background: "#000", width: "100%", height: "100%" }} />;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#000",
        overflow: "hidden",
      }}
    >
      <ReactYouTube
        videoId={videoId as string}
        opts={opts}
        onReady={handlePlayerReady}
        onStateChange={handlePlayerStateChange}
        className="absolute inset-0"
        iframeClassName="w-full h-full"
      />
      {/* 터치 차단 오버레이 — YouTube 직접 조작 방지, 네이티브가 제어 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 100,
          background: "transparent",
        }}
      />
    </div>
  );
}
