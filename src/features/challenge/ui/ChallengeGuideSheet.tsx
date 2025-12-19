import { useState } from "react";
import { FaChevronRight, FaCheck } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";
import { BsGift } from "react-icons/bs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// ============================================
// 챌린지 안내 가이드 (텍스트 링크 + 바텀시트)
// ============================================

export function ChallengeGuideLink() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-1 w-full py-2 text-sm text-gray-500
          transition-colors active:text-gray-700"
      >
        <span>챌린지 안내 보기</span>
        <FaChevronRight size={10} />
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
                  number={1}
                  icon={<FaCheck className="text-orange-500" size={14} />}
                  title="레시피 선택"
                  description="챌린지 레시피 중 원하는 요리를 선택해요"
                />
                <GuideStep
                  number={2}
                  icon={<span className="text-lg">🍳</span>}
                  title="요리하기"
                  description="레시피를 보며 맛있게 요리해요"
                />
                <GuideStep
                  number={3}
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
                  일주일 동안 <span className="font-bold text-orange-600">3끼</span>를
                  요리하고 인증하면 챌린지 완료!
                </p>
              </div>
            </section>

            {/* 리워드 */}
            <section>
              <h3 className="font-bold text-gray-800 mb-3">리워드</h3>
              <div className="flex items-center gap-3 bg-gradient-to-r from-orange-100 to-amber-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <BsGift className="text-white" size={18} />
                </div>
                <p className="text-gray-700">
                  챌린지 완료 시 <span className="font-bold text-orange-600">특별 선물</span> 증정!
                </p>
              </div>
            </section>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// 가이드 스텝 아이템
function GuideStep({
  number,
  icon,
  title,
  description,
}: {
  number: number;
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
