import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchBalance } from "./api/api";

export const BALANCE_QUERY_KEY = "BALANCE_QUERY_KEY";

export const useFetchBalance = () => {
    const { data, isLoading, error } = useSuspenseQuery({
      queryKey: [BALANCE_QUERY_KEY],
      queryFn: fetchBalance,
    });
    return { data, isLoading, error };
  };
