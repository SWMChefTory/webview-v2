import { useState } from "react";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FiExternalLink } from "react-icons/fi";
import { FaChevronRight, FaCheck } from "react-icons/fa";
import { BsGift } from "react-icons/bs";
import { MODE, request } from "@/src/shared/client/native/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { calculateDday } from "../lib/formatDate";

interface ChallengeBottomBarProps {
  kakaoUrl: string;
  endDate: string;
}

export function ChallengeBottomBar({ kakaoUrl, endDate }: ChallengeBottomBarProps) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const isEnded = calculateDday(endDate) === "종료";

  const handleButtonClick = () => {
    if (typeof window !== "undefined" && window.ReactNativeWebView) {
      request(MODE.UNBLOCKING, "OPEN_EXTERNAL_URL", { url: kakaoUrl });
    } else {
      window.open(kakaoUrl, "_blank");
    }
  };

  return (
    <>
      {/* 하단 고정 바 */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-3 pb-safe"
        style={{
          boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* 메인 버튼 */}
        {isEnded ? (
          <button
            onClick={handleButtonClick}
            className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2.5
              transition-all duration-200
              active:scale-[0.98]
              bg-orange-500 border border-orange-400"
            style={{
              boxShadow: "0 2px 8px -2px rgba(249, 115, 22, 0.4)",
            }}
          >
            <span className="text-white font-semibold text-sm">
              다음 챌린지도 참여하고 싶어요
            </span>
            <FiExternalLink size={12} className="text-white/70" />
          </button>
        ) : (
          <button
            onClick={handleButtonClick}
            className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2.5
              transition-all duration-200
              active:scale-[0.98]
              border border-yellow-400/50"
            style={{
              backgroundColor: "#FEE500",
              boxShadow: "0 2px 8px -2px rgba(254, 229, 0, 0.4)",
            }}
          >
            <RiKakaoTalkFill size={20} className="text-black/85" />
            <span className="text-black/85 font-semibold text-sm">
              카카오톡에서 인증하기
            </span>
            <FiExternalLink size={12} className="text-black/60" />
          </button>
        )}

        {/* 챌린지 안내 링크 */}
        <button
          onClick={() => setIsGuideOpen(true)}
          className="flex items-center justify-center gap-1 w-full py-2.5 text-xs text-gray-500
            transition-colors active:text-gray-700"
        >
          <span>챌린지 안내 보기</span>
          <FaChevronRight size={8} />
        </button>
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
