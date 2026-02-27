import { cn } from "@/lib/utils";
import { AlertTriangle, Info, Minus, MessageSquare } from "lucide-react";
import type { RecipeReportReason } from "@/src/entities/recipe-report";
import { useRecipeReportTranslation } from "../hooks/useRecipeReportTranslation";

const REASONS: RecipeReportReason[] = [
  "INAPPROPRIATE_CONTENT",
  "MISINFORMATION",
  "LOW_QUALITY",
  "OTHER",
];

const REASON_ICONS: Record<RecipeReportReason, React.ComponentType<{ className?: string }>> = {
  INAPPROPRIATE_CONTENT: AlertTriangle,
  MISINFORMATION: Info,
  LOW_QUALITY: Minus,
  OTHER: MessageSquare,
};

const REASON_COLORS: Record<RecipeReportReason, string> = {
  INAPPROPRIATE_CONTENT: "text-red-500",
  MISINFORMATION: "text-blue-500",
  LOW_QUALITY: "text-yellow-500",
  OTHER: "text-gray-500",
};

interface RecipeReportReasonListProps {
  selectedReason: RecipeReportReason | null;
  onSelect: (reason: RecipeReportReason) => void;
}

export function RecipeReportReasonList({
  selectedReason,
  onSelect,
}: RecipeReportReasonListProps) {
  const { t } = useRecipeReportTranslation();

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-500 px-1 mb-1">
        신고 사유를 선택해주세요
      </p>
      {REASONS.map((reason) => {
        const Icon = REASON_ICONS[reason];
        const isSelected = selectedReason === reason;
        return (
          <button
            key={reason}
            type="button"
            onClick={() => onSelect(reason)}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left transition-all border",
              isSelected
                ? "bg-orange-50 border-orange-200 shadow-sm"
                : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
            )}
            aria-pressed={isSelected}
          >
            <div className={cn("flex-shrink-0", REASON_COLORS[reason])}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={cn(
              "font-medium",
              isSelected ? "text-orange-700" : "text-gray-700"
            )}>
              {t(`reason.${reason}`)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
