import Header, { BackButton, ProfileButton } from "@/src/shared/ui/header";
import { GoChevronRight } from "react-icons/go";
import { useRouter } from "next/router";
import Chef from "@/src/pages/settings/assets/chef.png";
import { MdEdit } from "react-icons/md";
import { PiUserSoundThin } from "react-icons/pi";
import { request, MODE } from "@/src/shared/client/native/client";

const LOGOUT = "LOGOUT";

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
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center w-[80] h-[80] bg-gray-200 rounded-full ">
            <div className="w-[60] h-[60]">
              <img
                src={Chef.src}
                className="block w-full h-full object-cover object-center"
              />
            </div>
          </div>
          <div className="h-1"></div>
          <div className="flex flex-row items-center justify-center gap-1">
            <div className="text-xl font-bold">홍길동</div>
            <MdEdit className="size-4 text-gray-500" />
          </div>
        </div>
        <div className="h-[32]" />
        <div className="flex flex-col gap-1 px-2 ">
          <div className="text-gray-500 pb-2"> 약관</div>
          <div className="flex flex-col gap-2 px-2">
            <div className="flex flex-row justify-between items-center">
              <div className="text-lg"> 개인정보 처리방침 </div>
              <GoChevronRight className="size-4 text-gray-500" />
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="text-lg"> 서비스 이용약관 </div>
              <GoChevronRight className="size-4 text-gray-500" />
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="text-lg"> 마케팅 활용 동의 </div>
              <GoChevronRight className="size-4 text-gray-500" />
            </div>
          </div>
        </div>
        <div className="h-[32]" />
        <div className="flex flex-row gap-6 items-center justify-center">
          <div onClick={() => {
            request(MODE.UNBLOCKING, LOGOUT);
          }} className="text-gray-500">로그아웃</div>
          <div className="text-red-500">회원탈퇴</div>
        </div>
      </div>
    </div>
  );
}

export { SettingsPage };
