import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  /** Intersection threshold (default: 0.1) */
  threshold?: number;
  /** Root margin for earlier trigger (default: "200px") */
  rootMargin?: string;
}

/**
 * Hook for infinite scroll with IntersectionObserver
 * 
 * @param fetchNextPage - Function to fetch next page
 * @param hasNextPage - Whether there are more pages to load
 * @param isFetchingNextPage - Whether currently fetching (optional, for double-fetch prevention)
 * @param options - IntersectionObserver options
 * @returns ref to attach to the sentinel element
 * 
 * @example
 * ```tsx
 * const { loadMoreRef } = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);
 * 
 * return (
 *   <div>
 *     {items.map(item => <Item key={item.id} />)}
 *     <div ref={loadMoreRef} className="h-20" />
 *   </div>
 * );
 * ```
 */
export function useInfiniteScroll(
  fetchNextPage: () => void,
  hasNextPage: boolean,
  isFetchingNextPage?: boolean,
  options?: UseInfiniteScrollOptions
) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMore = loadMoreRef.current;
    if (!loadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const shouldFetch = 
          entries[0].isIntersecting && 
          hasNextPage && 
          (isFetchingNextPage === undefined || !isFetchingNextPage);
        
        if (shouldFetch) {
          fetchNextPage();
        }
      },
      {
        threshold: options?.threshold ?? 0.1,
        rootMargin: options?.rootMargin ?? "200px",
      }
    );

    observer.observe(loadMore);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage, options?.threshold, options?.rootMargin]);

  return { loadMoreRef };
}
