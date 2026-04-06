import { useRouter } from "next/router";
import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

const ReactYouTube = dynamic(() => import("react-youtube"), { ssr: false });

const SAMPLE_RATE = 16000;
const DEFAULT_VIDEO_ID = "ME1Mr6TyqSQ";

// ── Native Bridge ──────────────────────────────────────────────────────────────

function postToNative(msg: unknown): string {
  const rnWebView = (window as any).ReactNativeWebView;
  if (rnWebView?.postMessage) {
    rnWebView.postMessage(JSON.stringify(msg));
    return "ios";
  }
  const ios = (window as any).webkit?.messageHandlers?.bridge;
  if (ios?.postMessage) {
    ios.postMessage(msg);
    return "ios";
  }
  const android = (window as any).AndroidBridge;
  if (android?.postMessage) {
    android.postMessage(JSON.stringify(msg));
    return "android";
  }
  console.warn("[no native bridge]", msg);
  return "none";
}

function uint8ToBase64(u8: Uint8Array): string {
  let binary = "";
  const STEP = 0x8000;
  for (let i = 0; i < u8.length; i += STEP) {
    binary += String.fromCharCode(...u8.subarray(i, i + STEP));
  }
  return btoa(binary);
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function VideoPage() {
  const router = useRouter();
  const videoId =
    (router.query.videoId as string | undefined) ?? DEFAULT_VIDEO_ID;

  // ─ YouTube ref ─
  const ytRef = useRef<YT.Player | null>(null);

  // ─ Audio state ─
  const [micReady, setMicReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const micReadyRef = useRef(false);
  const isRecordingRef = useRef(false);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const chunkCountRef = useRef(0);
  const requestIdRef = useRef<string | null>(null);

  // ─── Acquire mic on mount ───
  const acquireMic = useCallback(async () => {
    if (micReadyRef.current) return true;
    try {
      console.log("[Video] Acquiring mic...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;
      const track = stream.getAudioTracks()[0];
      console.log("[Video] Mic acquired, settings:", track.getSettings());
      micReadyRef.current = true;
      setMicReady(true);
      postToNative({ type: "debug", msg: "mic_ready" });
      return true;
    } catch (e: any) {
      console.error("[Video] getUserMedia failed:", e);
      postToNative({ type: "debug", msg: "mic_error: " + e.message });
      return false;
    }
  }, []);

  // noMic=1 파라미터가 있으면 마이크 획득 안 함 (Android 네이티브 SpeechRecognizer 사용 시)
  const noMic = router.query.noMic === '1';
  useEffect(() => {
    if (!noMic) {
      acquireMic();
    }
  }, [noMic]);

  // ─── Start recording ───
  const start = useCallback(async () => {
    console.log("[Video] start() called");
    postToNative({ type: "debug", msg: "start() called" });

    if (!streamRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: false,
          },
        });
        streamRef.current = stream;
        micReadyRef.current = true;
        setMicReady(true);
      } catch (e: any) {
        console.error("[Video] getUserMedia failed in start():", e);
        postToNative({
          type: "debug",
          msg: "getUserMedia_failed: " + e.message,
        });
        return;
      }
    }

    chunkCountRef.current = 0;
    const stream = streamRef.current;

    // 16kHz AudioContext - browser resamples 48kHz -> 16kHz internally
    const audioCtx = new AudioContext({ sampleRate: SAMPLE_RATE });
    audioCtxRef.current = audioCtx;

    await audioCtx.audioWorklet.addModule("/pcm-worklet.js");

    const source = audioCtx.createMediaStreamSource(stream);
    sourceRef.current = source;

    const workletNode = new AudioWorkletNode(audioCtx, "pcm-worklet");
    workletNodeRef.current = workletNode;

    // Send start message to native
    requestIdRef.current = crypto.randomUUID();
    postToNative({
      type: "audio_stream_start",
      requestId: requestIdRef.current,
      mime: "audio/pcm;format=s16le;rate=16000;channels=1",
      sampleRate: SAMPLE_RATE,
    });

    // PCM chunk -> base64 -> native
    workletNode.port.onmessage = (ev) => {
      const ab = ev.data;
      if (!(ab instanceof ArrayBuffer)) return;

      const requestId = requestIdRef.current;
      if (requestId) {
        const u8 = new Uint8Array(ab);
        const base64 = uint8ToBase64(u8);
        postToNative({
          type: "audio_stream_chunk",
          requestId,
          index: chunkCountRef.current,
          base64,
          bytes: u8.byteLength,
        });
      }
      chunkCountRef.current++;
    };

    source.connect(workletNode);
    const zeroGain = audioCtx.createGain();
    zeroGain.gain.value = 0;
    workletNode.connect(zeroGain).connect(audioCtx.destination);

    isRecordingRef.current = true;
    setIsRecording(true);
    console.log("[Video] Recording started");
    postToNative({ type: "debug", msg: "recording_started" });
  }, []);

  // ─── Stop recording ───
  const stop = useCallback(async () => {
    const requestId = requestIdRef.current;
    if (requestId) {
      postToNative({ type: "audio_stream_end", requestId });
    }
    requestIdRef.current = null;

    workletNodeRef.current?.disconnect();
    sourceRef.current?.disconnect();
    workletNodeRef.current = null;
    sourceRef.current = null;

    if (audioCtxRef.current) {
      try {
        await audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }

    isRecordingRef.current = false;
    setIsRecording(false);
    console.log("[Video] Recording stopped");
  }, []);

  // ─── Expose global functions for native to call ───
  const startRef = useRef(start);
  const stopRef = useRef(stop);
  startRef.current = start;
  stopRef.current = stop;

  useEffect(() => {
    (window as any).__startRecording = async () => {
      const ready = micReadyRef.current;
      const recording = isRecordingRef.current;
      console.log(
        "[__startRecording] micReady:",
        ready,
        "isRecording:",
        recording,
      );
      if (!recording && ready) {
        await startRef.current();
      } else if (!ready) {
        postToNative({ type: "debug", msg: "mic_not_ready_yet" });
      }
    };
    (window as any).__stopRecording = async () => {
      console.log("[__stopRecording] called");
      if (isRecordingRef.current) await stopRef.current();
    };
    return () => {
      delete (window as any).__startRecording;
      delete (window as any).__stopRecording;
    };
  }, []);

  // ─── Cleanup on unmount ───
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  // ─── YouTube seek handler (native can call via postMessage) ───
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        const data =
          typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.type === "SEEK_TO" && typeof data.seconds === "number") {
          ytRef.current?.seekTo(data.seconds, true);
          ytRef.current?.playVideo();
        }
        if (data.type === "PAUSE_VIDEO") {
          ytRef.current?.pauseVideo();
        }
        if (data.type === "PLAY_VIDEO") {
          ytRef.current?.playVideo();
        }
      } catch {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black flex flex-col">
      {/* YouTube 16:9 */}
      <div className="w-full" style={{ aspectRatio: "16/9" }}>
        <div className="w-full h-full relative">
          <ReactYouTube
            videoId={videoId}
            className="absolute inset-0"
            iframeClassName="w-full h-full"
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                playsinline: 1,
                controls: 1,
                rel: 0,
              },
            }}
            onReady={(e) => {
              ytRef.current = e.target;
              postToNative({ type: "youtube_ready", videoId });
            }}
            onStateChange={(e) => {
              // YT.PlayerState: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
              postToNative({
                type: "youtube_state",
                state: e.data,
                currentTime: ytRef.current?.getCurrentTime() ?? 0,
              });
            }}
          />
        </div>
      </div>

      {/* Recording hidden - mic is always acquired, recording controlled by native */}
      {/* Debug indicator (hidden in production, visible for dev) */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-none">
        {isRecording && (
          <span className="inline-flex items-center gap-1.5 bg-red-600/80 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            REC
          </span>
        )}
        {!micReady && (
          <span className="text-yellow-400/80 text-xs bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
            Mic acquiring...
          </span>
        )}
      </div>
    </div>
  );
}
