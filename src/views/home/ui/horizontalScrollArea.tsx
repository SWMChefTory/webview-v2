/**
 *
 * @param children - scrollarea에서 보여줄 컨텐츠
 * @param onReachEnd - 스크롤 영역 끝에 도달했을 때 호출될 함수. 스크롤 영역 끝이란 스크롤 컨텐츠의 전체 길이에 10px를 더한 값을 초과했을 때를 의미한다.
 */

import { useEffect, useRef } from "react";

export function HorizontalScrollArea({
  children,
  onReachEnd,
}: {
  children: React.ReactNode;
  onReachEnd?: () => void;
}) {
  const calledRef = useRef(false);
  return (
    <div
      className="whitespace-nowrap w-[100vw] overflow-x-scroll scrollbar-hide no-scrollbar"
      onScroll={(e) => {
        const el = e.currentTarget;

        const reachedEnd =
          el.scrollLeft + el.clientWidth >= el.scrollWidth - 10; 

        if (reachedEnd) {
          if (!calledRef.current) {
            calledRef.current = true;
            onReachEnd?.();
          }
        } else {
          // 끝에서 벗어나면 다시 호출 가능하게 리셋
          calledRef.current = false;
        }
      }}

    >
      <div className="pl-4 flex flex-row gap-2 whitespace-normal min-w-[100.5vw]">
        {children}
      </div>
    </div>
  );
}

// export function HorizontalScrollArea({
//   children,
//   onReachEnd,
// }: {
//   children: React.ReactNode;
//   onReachEnd?: () => void;
// }) {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const sentinelRef = useRef<HTMLDivElement | null>(null)

//   useEffect(() => {
//     const root = containerRef.current;
//     const target = sentinelRef.current;

//     if (!root || !target || !onReachEnd) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           onReachEnd();
//         }
//       },
//       {
//         root,
//         rootMargin: "0px 200px 0px 0px", 
//         threshold: 0,
//       }
//     );

//     observer.observe(target);

//     return () => observer.disconnect();
//   }, [onReachEnd]);

//   return (
//     <div
//       ref={containerRef}
//       className="whitespace-nowrap w-[100vw] overflow-x-scroll scrollbar-hide no-scrollbar"
//     >
//       <div className="pl-4 flex flex-row gap-2 whitespace-normal min-w-[100.5vw]">
//         {children}
//         <div
//           ref={sentinelRef}
//           className="w-px h-px shrink-0"
//         />
//       </div>
//     </div>
//   );
// }