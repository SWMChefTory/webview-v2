import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { fetchUser, Gender } from "@/src/entities/user/api";
import { UserResponse } from "@/src/entities/user/api";

type User = {
  gender: Gender | null | undefined;
  nickname: string;
  tag: string;
  dateOfBirth: string | null | undefined;
  isMarketingAgreed: boolean;
  isTermsAgreed: boolean;
  isPrivacyPolicyAgreed: boolean;
};

/**
 * providerSub를 기반으로 4자리 사용자 태그를 생성합니다.
 * djb2 해시 알고리즘을 사용하여 일관된 결과를 보장합니다.
 */
function generateUserTag(providerSub: string): string {
  let hash = 5381;
  for (let i = 0; i < providerSub.length; i++) {
    hash = ((hash << 5) + hash) + providerSub.charCodeAt(i);
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

function useFetchUserModel() {
  const { data: user } = useSuspenseQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    select: createUser,
  });
  return {
    user,
  };
}

function useFetchUserModelNotSuspense() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
  return {
    user,
    isLoading: isLoading,
    error: error,
  };
}

export { useFetchUserModel, useFetchUserModelNotSuspense };
