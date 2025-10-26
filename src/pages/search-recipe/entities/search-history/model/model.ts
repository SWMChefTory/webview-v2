import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSearchHistories,
  deleteSearchHistory,
  deleteAllSearchHistories,
  SearchHistoriesData,
} from "../api/api";

const SEARCH_HISTORY_QUERY_KEY = "searchHistory";

export class SearchHistories {
  public recipeSearchHistories!: Array<{ history: string }>;
  
  constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }
  
  static create(data: SearchHistoriesData) {
    return new SearchHistories(data);
  }
  
  static createEmpty() {
    return new SearchHistories({ recipeSearchHistories: [] });
  }
  
  // 편의 메서드: 문자열 배열로 변환
  get histories(): string[] {
    return this.recipeSearchHistories.map(item => item.history);
  }
}

// 최근 검색 기록 조회 훅
export function useSearchHistories() {
  const { data, isLoading, error } = useQuery({
    queryKey: [SEARCH_HISTORY_QUERY_KEY],
    queryFn: fetchSearchHistories,
    select: (data) => SearchHistories.create(data),
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });

  return {
    searchHistories: data ?? SearchHistories.createEmpty(),
    isLoading,
    error,
  };
}

// 검색 기록 삭제 훅
export function useDeleteSearchHistory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteSearchHistory,
    onSuccess: () => {
      // 삭제 후 캐시 무효화하여 다시 조회
      queryClient.invalidateQueries({ queryKey: [SEARCH_HISTORY_QUERY_KEY] });
    },
  });
}

// 모든 검색 기록 삭제 훅
export function useDeleteAllSearchHistories() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAllSearchHistories,
    onSuccess: () => {
      // 삭제 후 캐시 무효화하여 다시 조회
      queryClient.invalidateQueries({ queryKey: [SEARCH_HISTORY_QUERY_KEY] });
    },
  });
}

export function useInvalidateSearchHistories() {
    const queryClient = useQueryClient();
    
    return () => {
      queryClient.removeQueries({ queryKey: [SEARCH_HISTORY_QUERY_KEY] });
      queryClient.refetchQueries({ queryKey: [SEARCH_HISTORY_QUERY_KEY] });
    };
  }
  
