import { useState } from "react";
import { Lightbulb, Play, X } from "lucide-react";
import type { PocStep } from "../types";
import { parseTimeToSeconds } from "../utils";

/** description 텍스트 추출 헬퍼 */
function getDescriptionText(desc: PocStep["description"]): string {
  if (typeof desc === "string") return desc;
  return desc.map((d) => d.content).join(" ");
}

/** description의 첫 번째 시작 시간 추출 */
function getFirstTimestamp(step: PocStep): number {
  if (Array.isArray(step.description) && step.description.length > 0) {
    return parseTimeToSeconds(step.description[0].start);
  }
  if (step.scenes && step.scenes.length > 0) {
    return parseTimeToSeconds(step.scenes[0].start);
  }
  return 0;
}

interface StepsSectionProps {
  steps: PocStep[];
  /** detail page에서 전달: step 클릭 시 해당 시간으로 seek */
  onSeekTo?: (seconds: number) => void;
}

export function StepsSection({ steps, onSeekTo }: StepsSectionProps) {
  const [selectedStep, setSelectedStep] = useState<PocStep | null>(null);

  const handleStepClick = (step: PocStep) => {
    if (onSeekTo) {
      // detail page: 해당 step 시간으로 영상 이동
      const sec = getFirstTimestamp(step);
      onSeekTo(sec);
    } else {
      // fallback: 바텀시트 열기
      setSelectedStep(step);
    }
  };

  return (
    <div className="px-4">
      <h2 className="text-lg font-bold text-gray-900">조리 순서</h2>
      <div className="h-3" />
      <div className="flex flex-col gap-3">
        {steps.map((step) => (
          <StepCard
            key={step.order}
            step={step}
            onClick={() => handleStepClick(step)}
            onDetail={() => setSelectedStep(step)}
            onSeekTo={onSeekTo}
          />
        ))}
      </div>

      {selectedStep && (
        <StepBottomSheet
          step={selectedStep}
          onClose={() => setSelectedStep(null)}
          onSeekTo={onSeekTo}
        />
      )}
    </div>
  );
}

function StepCard({
  step,
  onClick,
  onDetail,
  onSeekTo,
}: {
  step: PocStep;
  onClick: () => void;
  onDetail: () => void;
  onSeekTo?: (seconds: number) => void;
}) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm
        transition-all duration-150 hover:border-orange-200 hover:shadow-md cursor-pointer active:opacity-70"
    >
      <div className="px-4 py-4">
        <h3 className="text-base font-bold text-gray-900">
          {step.order}. {step.title}
        </h3>

        {/* 작은 step 카드들 */}
        {Array.isArray(step.description) && (
          <div className="mt-2 flex flex-col gap-1.5">
            {step.description.map((item, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSeekTo) {
                    // detail page: 해당 세부 step 시간으로 영상 이동
                    onSeekTo(parseTimeToSeconds(item.start));
                  } else {
                    onDetail();
                  }
                }}
                className="flex items-center gap-2 rounded-lg bg-gray-50
                  border border-gray-100
                  shadow-[0_1px_4px_rgba(0,0,0,0.04)]
                  px-2.5 py-1.5
                  transition-all duration-150
                  hover:bg-orange-50 hover:border-orange-200
                  active:scale-[0.98] cursor-pointer group/item"
              >
                <p className="flex-1 text-sm text-gray-700 leading-snug min-w-0
                  group-hover/item:text-gray-900">
                  {item.content}
                </p>
                <Play className="shrink-0 w-3.5 h-3.5 text-gray-300
                  group-hover/item:text-orange-500
                  transition-colors" />
              </div>
            ))}
          </div>
        )}

        {typeof step.description === "string" && (
          <p className="text-sm text-gray-600 leading-relaxed mt-1">
            {step.description}
          </p>
        )}
      </div>
    </div>
  );
}

function StepBottomSheet({
  step,
  onClose,
  onSeekTo,
}: {
  step: PocStep;
  onClose: () => void;
  onSeekTo?: (seconds: number) => void;
}) {
  const tips = Array.isArray(step.tip) ? step.tip : step.tip ? [step.tip] : [];

  const scenes = step.scenes ?? [];

  const handleSceneClick = (sceneIndex: number) => {
    const scene = scenes[sceneIndex];
    if (scene && onSeekTo) {
      onSeekTo(parseTimeToSeconds(scene.start));
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl animate-slide-up max-h-[80dvh] overflow-y-auto">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-white rounded-t-2xl">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3">
          <h3 className="text-lg font-bold text-gray-900">
            {step.order}. {step.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed px-5 pb-4">
          {getDescriptionText(step.description)}
        </p>

        {/* Knowledge (TIP) */}
        {step.knowledge && (
          <div className="mx-5 mb-3 px-3 py-2 bg-blue-50 rounded-lg">
            <span className="font-semibold text-xs text-blue-700">TIP: </span>
            {(Array.isArray(step.knowledge) ? step.knowledge : [step.knowledge]).map((k, i, arr) => (
              <p key={i} className="text-xs text-blue-700 leading-relaxed">
                {arr.length > 1 ? `${i + 1}. ` : ""}{k}
              </p>
            ))}
          </div>
        )}

        {/* Q&A (tip array) */}
        {tips.length > 0 && (
          <div className="mx-5 mb-4 px-3 py-2 bg-amber-50 rounded-lg flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">Q&A</span>
            </div>
            {tips.map((t, i) => (
              <p key={i} className="text-xs text-amber-800 leading-relaxed">
                {tips.length > 1 ? `${i + 1}. ` : ""}
                {t}
              </p>
            ))}
          </div>
        )}

        {/* Scene list with play buttons */}
        {scenes.length > 0 && <div className="px-5 pb-4 flex flex-col gap-1">
          {scenes.map((scene, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSceneClick(i)}
              className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200
                transition-all duration-150
                hover:bg-orange-50 hover:border-orange-300
                active:scale-[0.98] cursor-pointer group"
            >
              <Play className="w-3 h-3 text-orange-500 fill-orange-500 shrink-0 group-hover:text-orange-600 group-hover:fill-orange-600" />
              <span className="text-sm text-gray-700 group-hover:text-orange-700">
                장면{i + 1}. {scene.label}
              </span>
            </button>
          ))}
        </div>}

        {/* Safe area bottom */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.25s ease-out;
        }
      `,
        }}
      />
    </>
  );
}
