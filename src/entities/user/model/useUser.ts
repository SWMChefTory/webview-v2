import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { fetchUser, type Gender, type UserResponse } from "@/src/entities/user/model/api/api";

export const USER_QUERY_KEY = ["user"] as const;

type User = {
  gender: Gender | null | undefined;
  nickname: string;
  tag: string;
  dateOfBirth: string | null | undefined;
  isMarketingAgreed: boolean;
  isTermsAgreed: boolean;
  isPrivacyPolicyAgreed: boolean;
};

function generateUserTag(providerSub: string): string {
  let hash = 5381;
  for (let i = 0; i < providerSub.length; i++) {
    hash = (hash << 5) + hash + providerSub.charCodeAt(i);
    hash = hash & hash;
  }
  return (Math.abs(hash) % 10000).toString().padStart(4, "0");
}

function createUser(user: UserResponse): User {
  return {
    gender: user.gender,
    nickname: user.nickname,
    tag: generateUserTag(user.providerSub),
    dateOfBirth: user.dateOfBirth,
    isMarketingAgreed: user.marketingAgreedAt !== null,
    isTermsAgreed: user.termsOfUseAgreedAt !== null,
    isPrivacyPolicyAgreed: user.privacyAgreedAt !== null,
  };
}

export function useFetchUserModel() {
  const { data: user } = useSuspenseQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchUser,
    select: createUser,
  });
  return { user };
}

export function useFetchUserModelNotSuspense() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchUser,
  });
  return {
    user,
    isLoading,
    error,
  };
}
