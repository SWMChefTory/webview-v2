import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 텍스트를 지정된 줄 수에 맞게 자르고, 넘치면 suffix("...더보기" 등)를 인라인으로 삽입하는 훅.
 *
 * hidden measurer element + binary search 기반으로 실제 렌더링 높이를 측정하므로
 * 한글/영문/숫자/특수문자 등 글자 너비 차이에 영향받지 않습니다.
 * ResizeObserver로 컨테이너 너비 변경 시 자동 재계산합니다.
 */
export const useTextTruncation = (
  text: string | undefined,
  suffix: string,
  maxLines: number,
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measurerRef = useRef<HTMLSpanElement>(null);
  const [truncatedText, setTruncatedText] = useState<string | null>(null);
  const [overflows, setOverflows] = useState(false);

  const computeTruncation = useCallback(() => {
    const container = containerRef.current;
    const measurer = measurerRef.current;
    if (!container || !measurer || !text) {
      setOverflows(false);
      setTruncatedText(null);
      return;
    }

    const containerWidth = container.clientWidth;
    measurer.style.width = `${containerWidth}px`;

    measurer.textContent = "\u200b";
    const singleLineHeight = measurer.offsetHeight;
    if (singleLineHeight === 0) return;

    const maxHeight = singleLineHeight * maxLines;

    measurer.textContent = text;
    if (measurer.offsetHeight <= maxHeight) {
      setOverflows(false);
      setTruncatedText(null);
      return;
    }

    setOverflows(true);
    let lo = 0;
    let hi = text.length;
    let best = 0;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      measurer.textContent = text.slice(0, mid) + suffix;
      if (measurer.offsetHeight <= maxHeight) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    let cutPos = best;
    if (cutPos < text.length && text[cutPos] !== " ") {
      const lastSpace = text.lastIndexOf(" ", cutPos);
      if (lastSpace > cutPos * 0.7) {
        measurer.textContent = text.slice(0, lastSpace) + suffix;
        if (measurer.offsetHeight <= maxHeight) {
          cutPos = lastSpace;
        }
      }
    }

    const PADDING_CHARS = 1;
    const paddedPos = Math.max(0, cutPos - PADDING_CHARS);
    const trimmed = text.slice(0, paddedPos).trimEnd();
    setTruncatedText(trimmed);
  }, [text, suffix, maxLines]);

  useEffect(() => {
    computeTruncation();
  }, [computeTruncation]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => computeTruncation());
    ro.observe(container);
    return () => ro.disconnect();
  }, [computeTruncation]);

  return { containerRef, measurerRef, truncatedText, overflows };
};
