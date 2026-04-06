import { useState } from "react";
import { Info } from "lucide-react";
import type { PocIngredient } from "../types";
import { formatUnit } from "../utils";
import { IngredientBottomModal } from "./IngredientBottomModal";

interface IngredientsSectionProps {
  ingredients: PocIngredient[];
}

function hasExtraInfo(ingredient: PocIngredient): boolean {
  return !!ingredient.substitute || !!ingredient.selectionTip;
}

export function IngredientsSection({ ingredients }: IngredientsSectionProps) {
  const [selectedIngredient, setSelectedIngredient] =
    useState<PocIngredient | null>(null);

  return (
    <div className="px-4">
      <h2 className="text-lg font-bold text-gray-900">재료</h2>
      <div className="h-2" />
      <div className="flex flex-wrap gap-1.5 justify-center">
        {ingredients.map((ingredient, index) => {
          const amountText =
            ingredient.amount.unit != null
              ? ingredient.amount.value !== null
                ? `${ingredient.amount.value} ${formatUnit(ingredient.amount.unit)}`
                : formatUnit(ingredient.amount.unit)
              : null;
          const clickable = hasExtraInfo(ingredient);

          return clickable ? (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIngredient(ingredient)}
              className="inline-flex w-fit shrink-0 rounded-lg border border-orange-200 px-2.5 py-1.5
                bg-orange-50/50
                transition-all duration-150
                hover:border-orange-300 hover:bg-orange-50
                active:scale-[0.96]
                cursor-pointer"
            >
              <div className="text-center">
                <div className="inline-flex items-center gap-0.5 font-semibold text-xs text-gray-900">
                  {ingredient.name}
                  <Info className="w-3 h-3 text-orange-400 shrink-0" />
                </div>
                {amountText && <div className="text-gray-500 text-[11px]">{amountText}</div>}
              </div>
            </button>
          ) : (
            <div
              key={index}
              className="inline-flex w-fit shrink-0 rounded-lg border border-gray-200 px-2.5 py-1.5 bg-white"
            >
              <div className="text-center">
                <div className="font-semibold text-xs text-gray-900">
                  {ingredient.name}
                </div>
                {amountText && <div className="text-gray-500 text-[11px]">{amountText}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <IngredientBottomModal
        ingredient={selectedIngredient}
        open={selectedIngredient !== null}
        onClose={() => setSelectedIngredient(null)}
      />
    </div>
  );
}
