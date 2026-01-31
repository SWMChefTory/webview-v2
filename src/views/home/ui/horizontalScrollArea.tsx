import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import { HorizontalScrollAreaMobile } from "./horizontalScrollArea.mobile";
import { HorizontalScrollAreaDesktop } from "./horizontalScrollArea.desktop";
import { HorizontalScrollAreaTablet } from "./horizontalScrollArea.tablet";

export type HorizontalScrollAreaProps = {
  children: React.ReactNode;
  moreLink?: string;
  gap?: string;
  aspectRatio?: string;
  onReachEnd?: () => void;
};

/**
 * Horizontal Scroll Area Router
 * - Desktop: Grid layout
 * - Tablet: Horizontal scroll layout
 */
export function HorizontalScrollArea(props: HorizontalScrollAreaProps) {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);

  if (isMobile) return <HorizontalScrollAreaMobile {...props} />;
  return isDesktop ? (
    <HorizontalScrollAreaDesktop {...props} />
  ) : (
    <HorizontalScrollAreaTablet {...props} />
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
