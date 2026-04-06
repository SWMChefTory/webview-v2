import { X } from "lucide-react";
import type { PocIngredient } from "../types";
import { formatUnit } from "../utils";

interface IngredientBottomModalProps {
  ingredient: PocIngredient | null;
  open: boolean;
  onClose: () => void;
}

export function IngredientBottomModal({
  ingredient,
  open,
  onClose,
}: IngredientBottomModalProps) {
  if (!open || !ingredient) return null;

  const amountText =
    ingredient.amount.unit != null
      ? ingredient.amount.value !== null
        ? `${ingredient.amount.value} ${formatUnit(ingredient.amount.unit)}`
        : formatUnit(ingredient.amount.unit)
      : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl animate-slide-up">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-lg font-bold text-gray-900">{ingredient.name}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="px-5 pb-6 flex flex-col gap-3">
          {amountText && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">용량</span>
              <span className="text-sm font-semibold text-gray-900">
                {amountText}
              </span>
            </div>
          )}
          {ingredient.substitute && (
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-500 shrink-0">
                대체재
              </span>
              <span className="text-sm text-gray-700">
                {ingredient.substitute}
              </span>
            </div>
          )}
          {ingredient.selectionTip && (
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-500 shrink-0">
                고르는 팁
              </span>
              <span className="text-sm text-gray-700">
                {ingredient.selectionTip}
              </span>
            </div>
          )}
        </div>
        {/* Safe area bottom */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.25s ease-out;
        }
      `}} />
    </>
  );
}
