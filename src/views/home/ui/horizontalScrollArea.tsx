/**
 *
 * @param children - scrollarea에서 보여줄 컨텐츠
 * @param onReachEnd - 스크롤 영역 끝에 도달했을 때 호출될 함수. 스크롤 영역 끝이란 스크롤 컨텐츠의 전체 길이에 10px를 더한 값을 초과했을 때를 의미한다.
 */

export function HorizontalScrollArea({
  children,
  onReachEnd,
}: {
  children: React.ReactNode;
  onReachEnd?: () => void;
}) {
  return (
    <div
      className="whitespace-nowrap w-[100vw] overflow-x-scroll scrollbar-hide no-scrollbar"
      onScroll={(e: any) => {
        if (
          e.target.scrollLeft + e.target.clientWidth >=
          e.target.scrollWidth + 10
        ) {
          onReachEnd?.();
        }
      }}
    >
      <div className="pl-4 flex flex-row gap-2 whitespace-normal min-w-[100.5vw]">
        {children}
      </div>
    </div>
  );
}
