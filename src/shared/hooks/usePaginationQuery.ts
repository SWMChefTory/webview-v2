import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

type CursorReturn<T> = {
  nextCursor: string|null;
  hasNext: boolean;
  data: T[];
};

export function useCursorPaginationQuery<T>({
  queryKey,
  queryFn,
}: {
  queryKey: readonly string[];
  queryFn: ({
    pageParam,
  }: {
    pageParam?: string | null;
  }) => Promise<CursorReturn<T>>;
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useSuspenseInfiniteQuery<
    CursorReturn<T>,
    Error,
    { entities: T[] },
    readonly string[],
    string | null | undefined
  >({
    queryKey,
    queryFn,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
    select: (data) => ({
      entities: data.pages.flatMap((page) => page.data),
    }),
    initialPageParam: null,
    staleTime: 5 * 60 * 1000,
  });

  const handleFetchNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  return {
    entities: data.entities,
    fetchNextPage: handleFetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    isLoading,
    error: error ?? null,
  };
}
