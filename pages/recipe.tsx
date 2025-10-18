import client from "@/src/shared/client/main/client";
import { useQuery } from "@tanstack/react-query";

function RecipePage(){
    

}

function useSearchResults(searchQuery: string) {
    console.log("안녕");
    const { data, isLoading, error, refetch } = useQuery({
      queryKey: ["searchResults", searchQuery],
      queryFn: () => fetchSearchResults(searchQuery),
      staleTime: 0,
    });
    return { data: data as any, isLoading, error, refetch };
  }
  
  async function fetchSearchResults(searchQuery: string) {
    const response = await client.get(
      `/recipes/search?query=${searchQuery}&page=${0}`
    );
    return response.data;
  }