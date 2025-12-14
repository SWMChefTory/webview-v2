import Header, { BackButton } from "@/src/shared/ui/header/header";
import { GoChevronRight } from "react-icons/go";
import { useRouter } from "next/router";
import Chef from "@/src/views/settings/assets/chef.png";
import { request, MODE } from "@/src/shared/client/native/client";
import { motion } from "framer-motion";
import { fetchUserModel } from "@/src/views/settings/entities/user/model";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { setMainAccessToken } from "@/src/shared/client/main/client";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";
import { ReactNode } from "react";
import { useLangcode, Lang } from "@/src/shared/translation/useLangCode";

// 다국어 메시지 포매터 정의
const formatSettingsMessages = (lang: Lang) => {
  switch (lang) {
    case "en":
      return {
        section: {
          terms: {
            title: "Terms and Agreements",
            privacy_policy: "Privacy Policy",
            service_terms: "Terms of Service",
          },
        },
        button: {
          logout: "Log Out",
          withdrawal: "Delete Account",
        },
      };
    default:
      return {
        section: {
          terms: {
            title: "약관 및 동의 항목",
            privacy_policy: "개인정보 처리방침",
            service_terms: "서비스 이용약관",
          },
        },
        button: {
          logout: "로그아웃",
          withdrawal: "회원탈퇴",
        },
      };
  }
};

function SettingsPage() {
  const router = useRouter();
  const lang = useLangcode(); // 1. 언어 설정 가져오기
  const messages = formatSettingsMessages(lang); // 2. 메시지 가져오기

  useSafeArea({
    top: { color: "#FFFFFF", isExists: true },
    bottom: { color: "#FFFFFF", isExists: true },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: false },
  });
  return (
    <div>
      <Header
        leftContent={
          <BackButton
            onClick={() => {
              router.push("/");
            }}
          />
        }
      />
      <div className=" px-4 flex flex-col justify-center">
        <SSRSuspense fallback={<UserSectionSkeleton />}>
          <UserSectionReady />
        </SSRSuspense>
        <div className="h-[32]" />
        <div className="flex flex-col gap-1 px-2 ">
          <div className="text-gray-500 pb-2">
            {messages.section.terms.title}
          </div>
          <div className="flex flex-col gap-2 px-2">
            <div className="flex flex-row justify-between items-center">
              <div
                className="text-lg"
                onClick={() => router.push("/user/settings/privacy-policy")}
              >
                {" "}
                {messages.section.terms.privacy_policy}{" "}
              </div>
              <GoChevronRight className="size-4 text-gray-500" />
            </div>
            <div className="flex flex-row justify-between items-center">
              <div
                className="text-lg"
                onClick={() =>
                  router.push("/user/settings/terms-and-conditions")
                }
              >
                {" "}
                {messages.section.terms.service_terms}{" "}
              </div>
              <GoChevronRight className="size-4 text-gray-500" />
            </div>
          </div>
        </div>
        <div className="h-[32]" />
        <div className="flex flex-row gap-6 items-center justify-center">
          <LogoutButton />
          <WithdrawalButton />
        </div>
      </div>
    </div>
  );
}

const UserSectionReady = () => {
  const { user } = fetchUserModel();

  return (
    <UserSectionTemplate
      profileImg={
        <img
          src={Chef.src}
          className="block w-full h-full object-cover object-center"
        />
      }
      name={<div className="text-xl font-bold">{user.nickname}</div>}
    />
  );
};

const UserSectionSkeleton = () => {
  return (
    <UserSectionTemplate
      profileImg={
        <img
          src={Chef.src}
          className="block w-full h-full object-cover object-center"
        />
      }
      name={
        <div className="w-[100]">
          <TextSkeleton fontSize="text-xl" />
        </div>
      }
    />
  );
};

const UserSectionTemplate = ({
  profileImg,
  name,
}: {
  profileImg: ReactNode;
  name: ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center w-[80] h-[80] bg-gray-200 rounded-full ">
        <div className="w-[60] h-[60]">{profileImg}</div>
      </div>
      <div className="h-1" />
      {name}
    </div>
  );
};

const LOGOUT = "LOGOUT";

function LogoutButton() {
  const lang = useLangcode();
  const messages = formatSettingsMessages(lang);

  return (
    <motion.div
      onClick={() => {
        setMainAccessToken("");
        request(MODE.UNBLOCKING, LOGOUT);
      }}
      whileTap={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      className="text-gray-500 rounded-md"
    >
      {messages.button.logout}
    </motion.div>
  );
}

function WithdrawalButton() {
  const router = useRouter();
  const lang = useLangcode();
  const messages = formatSettingsMessages(lang);

  return (
    <motion.div
      onClick={() => {
        router.push("/user/settings/membership-withdrawal");
      }}
      whileTap={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      className="text-red-500 rounded-md"
    >
      {messages.button.withdrawal}
    </motion.div>
  );
}

export default SettingsPage;