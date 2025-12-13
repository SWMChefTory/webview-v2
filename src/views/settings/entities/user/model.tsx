import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchUser, Gender } from "@/src/views/settings/entities/user/api";
import { UserResponse } from "@/src/views/settings/entities/user/api";

type User = {
  gender: Gender | null | undefined;
  nickname: string;
  dateOfBirth: string | null | undefined;
  isMarketingAgreed: boolean;
  isTermsAgreed: boolean;
  isPrivacyPolicyAgreed: boolean;
};

function createUser(user: UserResponse): User {
  return {
    gender: user.gender,
    nickname: user.nickname,
    dateOfBirth: user.dateOfBirth,
    isMarketingAgreed: user.marketingAgreedAt !== null,
    isTermsAgreed: user.termsOfUseAgreedAt !== null,
    isPrivacyPolicyAgreed: user.privacyAgreedAt !== null,
  };
}

function fetchUserModel() {
  const { data: user } = useSuspenseQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    select: createUser,
  });
  return {
    user,
  };
}

export { fetchUserModel };
