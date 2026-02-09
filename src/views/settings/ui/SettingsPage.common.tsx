import { GoChevronRight } from "react-icons/go";
import { useRouter } from "next/router";
import Chef from "@/src/views/settings/assets/chef.png";
import { request, MODE } from "@/src/shared/client/native/client";
import { motion } from "motion/react";
import { useFetchUserModel } from "@/src/entities/user/model";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { setMainAccessToken } from "@/src/shared/client/main/client";
import { ReactNode } from "react";
import { useSettingsTranslation } from "../hooks/useSettingsTranslation";
import { useFetchBalance } from "@/src/entities/balance/model/useFetchBalance";
import Image from "next/image";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useCreditRechargeModalStore } from "@/src/widgets/credit-recharge-modal/creditRechargeModalStore";

/**
 * 공통 컴포넌트: 모바일/태블릿 모두 사용
 */

// ============================================
// User Section
// ============================================

/**
 * 프로필 섹션 템플릿
 * @param isTablet - 태블릿 여부 (크기 조정용)
 */
export const UserSectionTemplate = ({
  profileImg,
  name,
  isTablet = false,
}: {
  profileImg: ReactNode;
  name: ReactNode;
  isTablet?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`flex items-center justify-center bg-gray-200 rounded-full ${
          isTablet ? "w-[100px] h-[100px]" : "w-[80px] h-[80px]"
        }`}
      >
        <div className={isTablet ? "w-[76px] h-[76px]" : "w-[60px] h-[60px]"}>
          {profileImg}
        </div>
      </div>
      <div className={isTablet ? "h-2" : "h-1"} />
      {name}
    </div>
  );
};

/**
 * 프로필 섹션 - Ready 상태
 */
export const UserSectionReady = ({ isTablet = false }: { isTablet?: boolean }) => {
  const { user } = useFetchUserModel();

  return (
    <UserSectionTemplate
      isTablet={isTablet}
      profileImg={
        <img
          src={Chef.src}
          className="block w-full h-full object-cover object-center"
          alt="profile"
        />
      }
      name={
        <div className={`font-bold ${isTablet ? "text-2xl" : "text-xl"}`}>
          {user.nickname}
          <span
            className={`text-gray-400 font-normal ml-1 ${
              isTablet ? "text-lg" : "text-base"
            }`}
          >
            #{user.tag}
          </span>
        </div>
      }
    />
  );
};

/**
 * 프로필 섹션 - Skeleton 상태
 */
export const UserSectionSkeleton = ({ isTablet = false }: { isTablet?: boolean }) => {
  return (
    <UserSectionTemplate
      isTablet={isTablet}
      profileImg={
        <img
          src={Chef.src}
          className="block w-full h-full object-cover object-center"
          alt="profile"
        />
      }
      name={
        <div className={isTablet ? "w-[120px]" : "w-[100px]"}>
          <TextSkeleton fontSize={isTablet ? "text-2xl" : "text-xl"} />
        </div>
      }
    />
  );
};

// ============================================
// Balance Section
// ============================================

/**
 * 잔액 섹션 - Skeleton 상태
 */
const BalanceRemainedSkeleton = ({ isTablet = false }: { isTablet?: boolean }) => {
  const { t } = useSettingsTranslation();
  return (
    <div className={isTablet ? "px-0" : "px-4"}>
      <div
        className={`flex items-center gap-1.5 px-4 rounded-full bg-red-50 justify-between ${
          isTablet ? "py-3" : "py-2"
        }`}
      >
        <div className="flex flex-row gap-1.5">
          <Image
            src="/images/berry/berry.png"
            alt="berry"
            width={isTablet ? 24 : 20}
            height={isTablet ? 24 : 20}
            className="object-contain"
          />
          <p className={`font-bold ${isTablet ? "text-lg" : ""}`}>
            {t("berry.balance", { count: 0 })}
          </p>
        </div>
        <p className={`text-red-500 font-semibold ${isTablet ? "text-base" : "text-sm"}`}>
          {t("berry.recharge")}
        </p>
      </div>
    </div>
  );
};

/**
 * 잔액 섹션 - Ready 상태
 */
const BalanceRemainedReadySection = ({ isTablet = false }: { isTablet?: boolean }) => {
  const { t } = useSettingsTranslation();
  const { data } = useFetchBalance();
  const { open } = useCreditRechargeModalStore();

  return (
    <div className={isTablet ? "px-0" : "px-4"}>
      <motion.div
        className={`flex items-center gap-1.5 px-4 rounded-full bg-red-50 justify-between cursor-pointer ${
          isTablet ? "py-3" : "py-2"
        }`}
        onClick={() => {
          track(AMPLITUDE_EVENT.RECHARGE_CLICK, {
            source: "settings",
          });
          open('settings');
        }}
        whileTap={{ scale: 0.98, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-row gap-1.5">
          <Image
            src="/images/berry/berry.png"
            alt="berry"
            width={isTablet ? 24 : 20}
            height={isTablet ? 24 : 20}
            className="object-contain"
          />
          <p className={`font-bold ${isTablet ? "text-lg" : ""}`}>
            {t("berry.balance", { count: data.balance })}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <p className={`text-red-500 font-semibold ${isTablet ? "text-base" : "text-sm"}`}>
            {t("berry.recharge")}
          </p>
          <GoChevronRight className={`text-red-500 ${isTablet ? "size-5" : "size-4"}`} />
        </div>
      </motion.div>
    </div>
  );
};

/**
 * 잔액 섹션 컨테이너
 */
export const BalanceSection = ({ isTablet = false }: { isTablet?: boolean }) => {
  return (
    <SSRSuspense fallback={<BalanceRemainedSkeleton isTablet={isTablet} />}>
      <BalanceRemainedReadySection isTablet={isTablet} />
    </SSRSuspense>
  );
};

// ============================================
// Action Buttons
// ============================================

const LOGOUT = "LOGOUT";

/**
 * 로그아웃 버튼
 */
export function LogoutButton({ isTablet = false }: { isTablet?: boolean }) {
  const { t } = useSettingsTranslation();

  return (
    <motion.div
      onClick={() => {
        setMainAccessToken("");
        request(MODE.UNBLOCKING, LOGOUT);
      }}
      whileTap={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      className={`text-gray-500 rounded-md ${isTablet ? "px-4 py-2 text-base" : ""}`}
    >
      {t("button.logout")}
    </motion.div>
  );
}

/**
 * 회원탈퇴 버튼
 */
export function WithdrawalButton({ isTablet = false }: { isTablet?: boolean }) {
  const router = useRouter();
  const { t } = useSettingsTranslation();

  return (
    <motion.div
      onClick={() => {
        router.push("/user/settings/membership-withdrawal");
      }}
      whileTap={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      className={`text-red-500 rounded-md ${isTablet ? "px-4 py-2 text-base" : ""}`}
    >
      {t("button.withdrawal")}
    </motion.div>
  );
}
