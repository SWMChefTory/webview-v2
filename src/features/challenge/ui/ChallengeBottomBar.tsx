import { useState } from "react";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FiExternalLink } from "react-icons/fi";
import { FaChevronRight, FaCheck } from "react-icons/fa";
import { BsGift } from "react-icons/bs";
import { MODE, request } from "@/src/shared/client/native/client";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getChallengeStatus, calculateDaysUntilStart } from "../lib/formatDate";
import { BEFORE_START_MESSAGES } from "../model/messages";
import { KAKAO_OPEN_CHAT_URLS } from "../model/constants";
import type { ChallengeType } from "../model/types";

interface ChallengeBottomBarProps {
  challengeType: ChallengeType;
  startDate: string;
  endDate: string;
}

export function ChallengeBottomBar({ challengeType, startDate, endDate }: ChallengeBottomBarProps) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const status = getChallengeStatus(startDate, endDate);
  const isBefore = status === "BEFORE";
  const isEnded = status === "ENDED";

  // 챌린지 타입에 맞는 카카오 오픈채팅 URL
  const kakaoUrl = KAKAO_OPEN_CHAT_URLS[challengeType];

  const handleButtonClick = () => {
    // Amplitude 트래킹
    track(AMPLITUDE_EVENT.CHALLENGE_VERIFY_CLICK);

    // 웹뷰 내에서 직접 열기 (현재 사용)
    if (typeof window !== "undefined") {
      window.location.href = kakaoUrl;
    }

    // [보류] 네이티브 앱 배포 후 아래 코드로 복원
    // if (typeof window !== "undefined" && window.ReactNativeWebView) {
    //   request(MODE.UNBLOCKING, "OPEN_EXTERNAL_URL", { url: kakaoUrl });
    // } else {
    //   window.open(kakaoUrl, "_blank");
    // }
  };

  return (
    <>
      {/* 하단 고정 바 */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 lg:px-6 pt-3 lg:pt-4 pb-safe"
        style={{
          boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] mx-auto">
        {/* 메인 버튼 */}
        {isBefore ? (
          // 시작 전: 비활성 상태 버튼 (파란색 계열)
          <div
            className="w-full py-3 lg:py-4 px-4 lg:px-6 rounded-xl flex items-center justify-center gap-2.5
              bg-blue-100 border border-blue-200"
          >
            <span className="text-blue-500 font-semibold text-sm lg:text-base">
              {calculateDaysUntilStart(startDate)}
            </span>
            <span className="text-blue-400 font-medium text-sm lg:text-base">
              {BEFORE_START_MESSAGES.button(startDate)}
            </span>
          </div>
        ) : isEnded ? (
          // 종료: 다음 챌린지 참여 유도 버튼
          <button
            onClick={handleButtonClick}
            className="w-full py-3 lg:py-4 px-4 lg:px-6 rounded-xl flex items-center justify-center gap-2.5
              transition-all duration-200
              active:scale-[0.98] lg:hover:shadow-lg lg:hover:-translate-y-0.5
              bg-orange-500 border border-orange-400"
            style={{
              boxShadow: "0 2px 8px -2px rgba(249, 115, 22, 0.4)",
            }}
          >
            <span className="text-white font-semibold text-sm lg:text-base">
              다음 챌린지도 참여하고 싶어요
            </span>
            <FiExternalLink size={12} className="text-white/70 lg:w-4 lg:h-4" />
          </button>
        ) : (
          // 진행 중: 카카오톡 인증 버튼
          <button
            onClick={handleButtonClick}
            className="w-full py-3 lg:py-4 px-4 lg:px-6 rounded-xl flex items-center justify-center gap-2.5
              transition-all duration-200
              active:scale-[0.98] lg:hover:shadow-lg lg:hover:-translate-y-0.5
              border border-yellow-400/50"
            style={{
              backgroundColor: "#FEE500",
              boxShadow: "0 2px 8px -2px rgba(254, 229, 0, 0.4)",
            }}
          >
            <RiKakaoTalkFill size={20} className="text-black/85 lg:w-6 lg:h-6" />
            <span className="text-black/85 font-semibold text-sm lg:text-base">
              인증하고 선물받기
            </span>
            <FiExternalLink size={12} className="text-black/60 lg:w-4 lg:h-4" />
          </button>
        )}

        {/* 챌린지 안내 링크 */}
        <button
          onClick={() => {
            track(AMPLITUDE_EVENT.CHALLENGE_GUIDE_CLICK);
            setIsGuideOpen(true);
          }}
          className="flex items-center justify-center gap-1 w-full py-2.5 lg:py-3 text-xs lg:text-sm text-gray-500
            transition-colors active:text-gray-700 lg:hover:text-gray-700"
        >
          <span>챌린지 안내 보기</span>
          <FaChevronRight size={8} />
        </button>
        </div>
      </div>

      {/* 챌린지 안내 시트 */}
      <Sheet open={isGuideOpen} onOpenChange={setIsGuideOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl px-0">
          <SheetHeader className="px-6 pb-2">
            <SheetTitle className="text-xl text-center">
              집밥 챌린지 안내
            </SheetTitle>
          </SheetHeader>

          <div className="px-6 pb-8 space-y-6">
            {/* 참여 방법 */}
            <section>
              <h3 className="font-bold text-gray-800 mb-3">참여 방법</h3>
              <div className="space-y-3">
                <GuideStep
                  icon={<FaCheck className="text-orange-500" size={14} />}
                  title="레시피 선택"
                  description="챌린지 레시피 중 원하는 요리를 선택해요"
                />
                <GuideStep
                  icon={<span className="text-lg">🍳</span>}
                  title="요리하기"
                  description="레시피를 보며 맛있게 요리해요"
                />
                <GuideStep
                  icon={<RiKakaoTalkFill className="text-yellow-500" size={16} />}
                  title="인증하기"
                  description="카카오톡 오픈채팅에서 완성 사진을 공유해요"
                />
              </div>
            </section>

            {/* 완료 조건 */}
            <section>
              <h3 className="font-bold text-gray-800 mb-3">완료 조건</h3>
              <div className="bg-orange-50 rounded-xl p-4">
                <p className="text-gray-700">
                  쉐프토리로 <span className="font-bold text-orange-600">3끼</span>를 요리하고 인증하면 챌린지 완료!
                </p>
              </div>
            </section>

            {/* 리워드 */}
            <section>
              <h3 className="font-bold text-gray-800 mb-3">리워드</h3>
              <div className="flex items-center gap-3 bg-linear-to-r from-orange-100 to-amber-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <BsGift className="text-white" size={18} />
                </div>
                <p className="text-gray-700">
                  챌린지 완료 시 <span className="font-bold text-orange-600">특별 선물</span> 증정!
                </p>
              </div>
            </section>

            {/* 유의사항 */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1.5">유의사항</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• 챌린지 레시피로 요리해야 인정돼요</li>
                <li>• 요리 시 쉐프토리 앱을 활용해주세요</li>
              </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// 가이드 스텝 아이템
function GuideStep({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
