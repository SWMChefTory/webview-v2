import { createPortal } from "react-dom";
import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useReportRecipe,
  type RecipeReportReason,
} from "@/src/entities/recipe-report";
import { useRecipeReportModalStore } from "../hooks/useRecipeReportModalStore";
import { useRecipeReportTranslation } from "../hooks/useRecipeReportTranslation";
import { RecipeReportReasonList } from "./RecipeReportReasonList";

export function RecipeReportModal() {
  const { isOpen, recipeId, close } = useRecipeReportModalStore();
  const { t } = useRecipeReportTranslation();
  const { mutate: reportRecipe, isPending } = useReportRecipe();

  const [selectedReason, setSelectedReason] = useState<RecipeReportReason | null>(null);
  const [description, setDescription] = useState("");
  const [step, setStep] = useState<"select" | "detail">("select");

  const handleSelectReason = useCallback((reason: RecipeReportReason) => {
    setSelectedReason(reason);
    setStep("detail");
  }, []);

  const handleBack = useCallback(() => {
    setStep("select");
  }, []);

  const resetState = useCallback(() => {
    setSelectedReason(null);
    setDescription("");
    setStep("select");
  }, []);

  const handleClose = useCallback(() => {
    close();
    resetState();
  }, [close, resetState]);

  const handleSubmit = useCallback(() => {
    if (!recipeId || !selectedReason) return;

    reportRecipe(
      {
        recipeId,
        reason: selectedReason,
        description: description || null,
      },
      {
        onSuccess: () => {
          alert(t("success"));
          handleClose();
        },
        onError: (error) => {
          const axiosError = error as { response?: { data?: { errorCode?: string } } };
          const errorCode = axiosError.response?.data?.errorCode;
          if (errorCode === "REPORT_001") {
            alert(t("error.DUPLICATE"));
          } else {
            alert(t("error.UNKNOWN"));
          }
        },
      }
    );
  }, [recipeId, selectedReason, description, reportRecipe, t, handleClose]);

  if (!isOpen || !recipeId) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1001]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl",
          "max-h-[80vh] overflow-y-auto"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          {step === "detail" && (
            <button
              type="button"
              onClick={handleBack}
              className="text-orange-500 font-medium"
            >
              {t("back")}
            </button>
          )}
          <h2 className="text-lg font-bold text-gray-900 flex-1 text-center">
            {t("title")}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1"
            aria-label="닫기"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {step === "select" ? (
            <RecipeReportReasonList
              selectedReason={selectedReason}
              onSelect={handleSelectReason}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {/* Selected Reason Display */}
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg">
                <span className="text-orange-600 font-medium">
                  {t(`reason.${selectedReason}`)}
                </span>
              </div>

              {/* Description Input */}
              <div className="flex flex-col gap-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("descriptionPlaceholder")}
                  maxLength={500}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <div className="text-right text-sm text-gray-400">
                  {t("descriptionCount", { count: description.length })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className={cn(
                  "w-full py-3 rounded-xl font-bold text-white transition-all",
                  "bg-orange-500 hover:bg-orange-600 active:bg-orange-700",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isPending ? t("submitting") : t("submit")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
