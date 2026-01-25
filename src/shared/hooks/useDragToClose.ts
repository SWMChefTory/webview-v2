import { useState, useRef, useCallback } from "react";

interface UseDragToCloseOptions {
  onClose: () => void;
  threshold?: number;
  thresholdPercentage?: number;
  scrollAreaRef?: React.RefObject<HTMLElement | null>;
}

interface UseDragToCloseReturn {
  dragOffset: number;
  isDragging: boolean;
  handlers: {
    onTouchStart: React.TouchEventHandler<HTMLElement>;
    onTouchMove: React.TouchEventHandler<HTMLElement>;
    onTouchEnd: React.TouchEventHandler<HTMLElement>;
  };
  style: {
    transform: string;
    transition: string;
  };
}

export function useDragToClose({
  onClose,
  threshold = 240,
  thresholdPercentage = 0.25,
  scrollAreaRef,
}: UseDragToCloseOptions): UseDragToCloseReturn {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);

  const onTouchStart: React.TouchEventHandler<HTMLElement> = useCallback(
    (e) => {
      startYRef.current = e.touches[0].clientY;

      const scrollTop = scrollAreaRef?.current?.scrollTop ?? 0;

      if (scrollTop <= 0) {
        setIsDragging(true);
      }
    },
    [scrollAreaRef]
  );

  const onTouchMove: React.TouchEventHandler<HTMLElement> = useCallback(
    (e) => {
      if (!isDragging) return;

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startYRef.current;
      const scrollTop = scrollAreaRef?.current?.scrollTop ?? 0;

      if (deltaY > 0 && scrollTop <= 0) {
        setDragOffset(deltaY);
        e.preventDefault();
      } else if (scrollTop > 0) {
        setIsDragging(false);
        setDragOffset(0);
      }
    },
    [isDragging, scrollAreaRef]
  );

  const onTouchEnd: React.TouchEventHandler<HTMLElement> = useCallback(() => {
    if (!isDragging) return;

    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight : 800;
    const computedThreshold = Math.min(threshold, viewportHeight * thresholdPercentage);
    const shouldClose = dragOffset > computedThreshold;

    setIsDragging(false);
    setDragOffset(0);

    if (shouldClose) {
      onClose();
    }
  }, [isDragging, dragOffset, threshold, thresholdPercentage, onClose]);

  return {
    dragOffset,
    isDragging,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
    style: {
      transform: `translateY(${dragOffset}px)`,
      transition: isDragging ? "none" : "transform 200ms ease",
    },
  };
}
