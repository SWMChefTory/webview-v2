import type { HorizontalScrollAreaProps } from "./horizontalScrollArea";

export function HorizontalScrollAreaMobile({
  children,
  gap = "gap-2",
  onReachEnd,
}: Pick<HorizontalScrollAreaProps, "children" | "gap" | "onReachEnd">) {
  return (
    <div
      className="whitespace-nowrap w-[100vw] overflow-x-scroll scrollbar-hide no-scrollbar"
      onScroll={(e) => {
        if (!onReachEnd) return;

        const el = e.currentTarget;
        const reachedEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
        if (reachedEnd) onReachEnd();
      }}
    >
      <div className={`pl-4 flex flex-row ${gap} whitespace-normal min-w-[100.5vw]`}>
        {children}
      </div>
    </div>
  );
}
