import { useState } from "react";
import { Sheet } from "react-modal-sheet";
import { ChevronDown } from "lucide-react";
import { RecipeBriefing } from "../../common/hook/useRecipeDetailController";
import { Skeleton } from "@/components/ui/skeleton";
import { TextSkeleton } from "@/src/shared/ui/skeleton";
import { useRecipeDetailTranslation } from "../../common/hook/useRecipeDetailTranslation";

const BriefingSummary = ({ briefings }: { briefings: RecipeBriefing[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useRecipeDetailTranslation();

  const Point = () => {
    return (
      <div className="w-1 h-1 mt-1.5 rounded-full bg-orange-500 flex-shrink-0" />
    );
  };

  return (
    <div className="px-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => { if (briefings.length > 2) setIsModalOpen(true); }}
        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && briefings.length > 2) { e.preventDefault(); setIsModalOpen(true); } }}
        className={`bg-gray-50 rounded-xl p-4 ${briefings.length > 2 ? 'cursor-pointer active:bg-gray-100 transition-colors duration-150' : ''}`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">{t("summary.reviews")}</h2>
          {briefings.length > 2 && (
            <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
              {t("summary.showMore")}
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-orange-100 text-orange-600 text-[10px] font-semibold rounded-full">
                +{briefings.length - 2}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </span>
          )}
        </div>
        <div className="h-2" />
        <div className="flex flex-col gap-1.5">
          {briefings.slice(0, 2).map((briefing, index) => (
            <div key={index} className="flex items-start gap-2">
              <Point />
              <p className="text-xs text-gray-600 leading-relaxed">{briefing.content}</p>
            </div>
          ))}
        </div>
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
            <div className="max-h-[75vh] flex flex-col overflow-hidden">
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
                  {t("summary.reviews")}{" "}
                  <span className="text-base font-medium text-gray-400">
                    {briefings.length}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {t("summary.reviewSource")}
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
                      <p className="text-sm text-neutral-800 leading-relaxed">
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
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="w-[30%]">
            <TextSkeleton fontSize="text-sm" />
          </div>
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <div className="h-2" />
        <div className="flex flex-col gap-1.5">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1 h-1 mt-1.5 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <TextSkeleton fontSize="text-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { BriefingSummary, BriefingSummarySkeleton };
