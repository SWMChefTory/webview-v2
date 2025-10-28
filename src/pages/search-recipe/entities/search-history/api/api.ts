import client from "@/src/shared/client/main/client";
import {z} from "zod";

const SearchHistoriesSchema = z.object({
  recipeSearchHistories: z.array(
    z.object({
      history: z.string(),
    })
  ),
});

export type SearchHistoriesData = z.infer<typeof SearchHistoriesSchema>;

// 최근 검색 기록 조회
export async function fetchSearchHistories() {
  const response = await client.get("/recipes/search/history");
  const parsedData = SearchHistoriesSchema.parse(response.data);
  return parsedData;
}

// 특정 검색어 삭제
export async function deleteSearchHistory(searchText: string) {
  const response = await client.delete("/recipes/search/history", {
    params: { searchText }
  });
  return response.data;
}

// 모든 검색 기록 삭제
export async function deleteAllSearchHistories() {
  const response = await client.delete("/recipes/search/history/all");
  return response.data;
}
