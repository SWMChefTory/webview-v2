import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchChallengeInfo } from "../api/challengeApi";

const CHALLENGE_INFO_QUERY_KEY = "challengeInfo";

export function useChallengeInfo() {
  return useSuspenseQuery({
    queryKey: [CHALLENGE_INFO_QUERY_KEY],
    queryFn: fetchChallengeInfo,
    staleTime: 5 * 60 * 1000, // 5분
  });
}
