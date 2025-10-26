import Header, { BackButton } from "@/src/shared/ui/header";
import { GoChevronRight } from "react-icons/go";
import { useRouter } from "next/router";
import Chef from "@/src/pages/settings/assets/chef.png";
import { MdEdit } from "react-icons/md";
import { request, MODE } from "@/src/shared/client/native/client";
import { motion } from "framer-motion";
import { fetchUserModel } from "@/src/pages/settings/entities/user/model";
import {Skeleton} from "@/components/ui/skeleton";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { setMainAccessToken } from "@/src/shared/client/main/client";

function SettingsPage() {
  const router = useRouter();
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
        <SSRSuspense fallback={<UserSection type="SKELETON" />}>
          <UserSection type="READY" />
        </SSRSuspense>
        <div className="h-[32]" />
        <div className="flex flex-col gap-1 px-2 ">
          <div className="text-gray-500 pb-2"> 약관 및 동의 항목</div>
          <div className="flex flex-col gap-2 px-2">
            <div className="flex flex-row justify-between items-center">
              <div
                className="text-lg"
                onClick={() => router.push("/user/settings/privacy-policy")}
              >
                {" "}
                개인정보 처리방침{" "}
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
                서비스 이용약관{" "}
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

const UserSection = ({ type }: { type: "READY" | "SKELETON" }) => {
  const { user } = fetchUserModel();
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center w-[80] h-[80] bg-gray-200 rounded-full ">
        <div className="w-[60] h-[60]">
          {type === "READY" ? (
            <img
              src={Chef.src}
              className="block w-full h-full object-cover object-center"
            />
          ) : (
            <Skeleton className="w-[60] h-[60] rounded-full"/>
          )}
        </div>
      </div>
      <div className="h-1" />
      <div className="flex flex-row items-center justify-center gap-1">
        {type === "READY" ? (
          <div className="text-xl font-bold">{user.nickname}</div>
        ) : (
          <TextSkeleton fontSize="text-lg" />
        )}
        {/* <MdEdit className="size-4 text-gray-500" /> */}
      </div>
    </div>
  );
};

const LOGOUT = "LOGOUT";

function LogoutButton() {
  return (
    <motion.div
      onClick={() => {
        setMainAccessToken("");
        request(MODE.UNBLOCKING, LOGOUT);
      }}
      whileTap={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      className="text-gray-500 rounded-md"
    >
      로그아웃
    </motion.div>
  );
}

function WithdrawalButton() {
  const router = useRouter();

  return (
    <motion.div
      onClick={() => {
        router.push("/user/settings/membership-withdrawal");
      }}
      whileTap={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      className="text-red-500 rounded-md"
    >
      회원탈퇴
    </motion.div>
  );
}

export default SettingsPage;
