import { cn } from "@/lib/utils";
import type { RecipeReportReason } from "@/src/entities/recipe-report";
import { useRecipeReportTranslation } from "../hooks/useRecipeReportTranslation";

const REASONS: RecipeReportReason[] = [
  "INAPPROPRIATE_CONTENT",
  "MISINFORMATION",
  "LOW_QUALITY",
  "OTHER",
];

const REASON_ICONS: Record<RecipeReportReason, string> = {
  INAPPROPRIATE_CONTENT: "⚠️",
  MISINFORMATION: "ℹ️",
  LOW_QUALITY: "⭐",
  OTHER: "📝",
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
    <div className="flex flex-col gap-1">
      {REASONS.map((reason) => (
        <button
          key={reason}
          type="button"
          onClick={() => onSelect(reason)}
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-all",
            "hover:bg-gray-100 active:bg-gray-200",
            selectedReason === reason && "bg-orange-50 border border-orange-200"
          )}
          aria-pressed={selectedReason === reason}
        >
          <span className="text-xl">{REASON_ICONS[reason]}</span>
          <span className="text-gray-900 font-medium">
            {t(`reason.${reason}`)}
          </span>
        </button>
      ))}
    </div>
  );
}
