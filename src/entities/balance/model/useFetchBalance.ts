import { QueryClient, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { fetchBalance } from "./api/api";
import { completeRecharge, RechargeResponse } from "./api/rechargeApi";

export const BALANCE_QUERY_KEY = "BALANCE_QUERY_KEY";

export const useFetchBalance = () => {
  const { data, isLoading, error } = useSuspenseQuery({
    queryKey: [BALANCE_QUERY_KEY],
    queryFn: fetchBalance,
    staleTime: 0,
    refetchOnMount: 'always',
  });
  return { data, isLoading, error };
};


export const useRechargeBalance = ({ onSuccess, onError, onSettled }: { onSuccess?: (data: RechargeResponse) => void, onError?: (error: Error) => void, onSettled?: () => void }) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: completeRecharge,
    onSuccess: (data) => {
      onSuccess?.(data);
      queryClient.invalidateQueries({ queryKey: [BALANCE_QUERY_KEY] });
    },
    onError: (error) => {
      onError?.(error);
    },
    onSettled: () => {
      onSettled?.();
    },
  });
  return { rechargeBalance: mutate, isPending, error };
};