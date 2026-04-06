import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeechRecognitionOptions {
  lang?: string;
  /** final transcript가 생성될 때마다 호출되는 콜백 */
  onFinalResult?: (text: string) => void;
}

interface UseSpeechRecognitionReturn {
  /** 브라우저가 SpeechRecognition을 지원하는지 여부 */
  isSupported: boolean;
  /** 현재 음성 인식 중인지 여부 */
  isListening: boolean;
  /** 인식된 텍스트 (interim + final) */
  transcript: string;
  /** 음성 인식 토글 */
  toggleListening: () => void;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const { lang = "ko-KR", onFinalResult } = options;

  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const onFinalResultRef = useRef(onFinalResult);

  // 최신 콜백 참조 유지
  useEffect(() => {
    onFinalResultRef.current = onFinalResult;
  }, [onFinalResult]);

  // 클라이언트에서만 SpeechRecognition 초기화 (hydration mismatch 방지)
  useEffect(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(interimTranscript || finalTranscript);

      // final 결과가 있으면 콜백 호출 → intent 분류에 사용
      if (finalTranscript.trim()) {
        onFinalResultRef.current?.(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: { error: string }) => {
      console.log("[SpeechRecognition] error:", event.error);
      if (event.error === "aborted" || event.error === "no-speech") return;
      console.log("에러에요");
      setIsListening(false);
      isListeningRef.current = false;
    };

    recognition.onend = () => {
      console.log("끝났어요");
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch {
          // 이미 시작됨 - 무시
        }
      } else {
        console.log("dmdma???");
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      isListeningRef.current = false;
      try {
        recognition.abort();
      } catch {
        // 시작되지 않음 - 무시
      }
      recognitionRef.current = null;
    };
  }, [lang]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      console.log("ref가 없어요");
      return
    };
    setTranscript("");
    isListeningRef.current = true;
    setIsListening(true);
    try {
      console.log("시작할게여");
      recognitionRef.current.start();
    } catch {
      // 이미 시작됨 - 무시
    }
  }, []);

  const stopListening = useCallback(() => {
    console.log("스탑");
    if (!recognitionRef.current) return;
    isListeningRef.current = false;
    setIsListening(false);
    try {
      recognitionRef.current.stop();
    } catch {
      // 시작되지 않음 - 무시
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListeningRef.current) {
      console.log("하위1");
      stopListening();
    } else {
      console.log("하위2");
      startListening();
    }
  }, [startListening, stopListening]);

  return {
    isSupported,
    isListening,
    transcript,
    toggleListening,
  };
}
