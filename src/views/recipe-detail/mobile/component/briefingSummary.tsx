import { useState } from "react";
import { Sheet } from "react-modal-sheet";
import { RecipeBriefing } from "../../common/hook/useRecipeDetailController";
import { Skeleton } from "@/components/ui/skeleton";
import { TextSkeleton } from "@/src/shared/ui/skeleton";

const BriefingSummary = ({ briefings }: { briefings: RecipeBriefing[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const Point = () => {
    return (
      <div className="w-1 h-1 mt-2.5 rounded-full bg-orange-500 flex-shrink-0" />
    );
  };

  return (
    <div className="px-4">
      <div className="text text-lg font-bold">실제 사용자 후기</div>
      <div className="h-2" />
      <div className="flex flex-col gap-2">
        {briefings.slice(0, 1).map((briefing, index) => (
          <div key={index} className="flex items-start gap-2">
            <Point />
            <div className="">{briefing.content}</div>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center px-2 py-2">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-6 h-9 bg-gray-200 rounded-md text-gray-700 font-medium
              transition-all duration-150
              hover:bg-gray-300
              active:scale-[0.97] active:bg-gray-300
              cursor-pointer"
        >
          {briefings.length - 1 && (
            <div>
              더보기{" "}
              <span className="text-xs text-gray-500">
                +{briefings.length - 1}
              </span>
            </div>
          )}
        </button>
      </div>

      {/* 후기 전체보기 바텀시트 */}
      <Sheet
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        detent="content"
      >
        <Sheet.Container className="!bg-white !rounded-t-3xl !shadow-2xl">
          <Sheet.Header className="!pt-3 !pb-0">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
          </Sheet.Header>
          <Sheet.Content className="!px-0">
            <div className="max-h-[70vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="relative px-5 pt-4 pb-4 border-b border-gray-100">
                <button
                  type="button"
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors active:scale-95"
                  onClick={() => setIsModalOpen(false)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-neutral-900 pr-8">
                  실제 사용자 후기
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  유튜브 댓글에서 추출한 후기입니다
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="flex flex-col gap-3 pb-4">
                  {briefings.map((briefing, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-1.5 h-1.5 mt-2 rounded-full bg-orange-500 flex-shrink-0" />
                      <p className="text-base text-neutral-800 leading-relaxed">
                        {briefing.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          onTap={() => setIsModalOpen(false)}
          className="!bg-black/50"
        />
      </Sheet>
    </div>
  );
};

const BriefingSummarySkeleton = () => {
  return (
    <div className="px-4">
      <div className="w-[30%]">
        <TextSkeleton fontSize="text-lg" />
      </div>
      <div className="h-2" />
      {/* 후기 텍스트 1건 (2줄) - 실제 컴포넌트와 동일한 구조/높이 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <div className="flex flex-col gap-1.5 flex-1">
            <TextSkeleton fontSize="text-base" />
          </div>
        </div>
      </div>
      {/* 더보기 버튼 - 실제: px-6 py-1.5 → h-8, 텍스트 "더보기 +N" → w-28 */}
      <div className="w-full flex justify-center px-2 py-2">
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </div>
  );
};

export { BriefingSummary, BriefingSummarySkeleton };
