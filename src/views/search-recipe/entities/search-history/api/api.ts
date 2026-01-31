import client from "@/src/shared/client/main/client";
import { z } from "zod";

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
  const response = await client.get("/search/histories",{
    params: { scope:"RECIPE" }
  });
  const parsedData = SearchHistoriesSchema.parse(response.data);
  return parsedData;
}

// 특정 검색어 삭제
export async function deleteSearchHistory(searchText: string) {
  const response = await client.delete("/search/histories", {
    params: { text: searchText, scope: "RECIPE" },
  });
  return response.data;
}

// 모든 검색 기록 삭제
export async function deleteAllSearchHistories() {
  const response = await client.delete("/search/histories", {
    params: { scope: "RECIPE" },
  });
  return response.data;
}
