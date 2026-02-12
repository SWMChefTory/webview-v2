import { useState } from "react";
import { ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { IngredientPurchaseModal } from "../../common/component/IngredientPurchaseModal";
import { Ingredient } from "../../common/hook/useRecipeDetailController";
import { TextSkeleton } from "@/src/shared/ui/skeleton";
import { useRecipeDetailTranslation } from "../../common/hook/useRecipeDetailTranslation";

const Ingredients = ({
  ingredients,
  recipeId,
}: {
  ingredients: Ingredient[];
  recipeId: string;
}) => {
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const { t } = useRecipeDetailTranslation();

  const visibleIngredients = showAllIngredients ? ingredients : ingredients.slice(0, 8);

  return (
    <div id="ingredients-section" className="px-4 gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{t("tabs.ingredients")}</h2>
        <button
          type="button"
          onClick={() => setPurchaseModalOpen(true)}
          className="flex items-center gap-1 text-orange-600 text-xs font-medium
            transition-colors duration-150
            hover:text-orange-700
            active:text-orange-800
            cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {t("ingredients.purchase")}
        </button>
      </div>
      <div className="h-2" />
      <div className="flex flex-wrap gap-1">
        {visibleIngredients.map((ingredient, index) => (
          <div
            className="inline-flex w-fit shrink-0 rounded-md border px-2 py-0.5"
            key={index}
          >
            <div className="text-center">
              <div className="font-semibold text-xs">{ingredient.name}</div>
              <div className="text-gray-500 text-[11px]">
                {!ingredient.amount || !ingredient.unit ? (
                  <>{t("ingredients.videoRef")}</>
                ) : (
                  <>
                    {ingredient.amount}
                    {`${ingredient.unit ? ` ${ingredient.unit}` : ""}`}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {ingredients.length > 8 && (
        <button
          type="button"
          onClick={() => setShowAllIngredients(!showAllIngredients)}
          className="w-full flex items-center justify-center gap-1 py-2 text-sm text-gray-600 font-medium
            transition-colors duration-150
            hover:text-gray-900
            active:text-gray-900
            cursor-pointer"
        >
          {showAllIngredients ? (
            <>
              {t("ingredients.showLess")}
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              {t("ingredients.showAll")}
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                +{ingredients.length - 8}
              </span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      <IngredientPurchaseModal
        open={purchaseModalOpen}
        onOpenChange={setPurchaseModalOpen}
        ingredients={ingredients}
        recipeId={recipeId}
      />
    </div>
  );
};

/**
 * 재료 스켈레톤
 * 실제 컴포넌트와 동일한 구조/높이를 유지
 * - 재료 칩: inline-flex rounded-md border px-2 py-1 + text-sm 2줄 = h-[50px]
 * - 구매 버튼: px-6 py-2 font-semibold rounded-lg = h-10, 텍스트 너비 → w-56
 */
const IngredientsSkeleton = () => {
  return (
    <div className="px-4 gap-2">
      <div className="flex items-center justify-between">
        <div className="w-[30%]"><TextSkeleton fontSize="text-lg" /></div>
        <Skeleton className="h-4 w-16 rounded" />
      </div>
      <div className="h-2" />
      <div className="flex flex-wrap gap-1">
        {[80, 64, 96, 56, 72, 88].map((w, i) => (
          <Skeleton
            key={i}
            className="h-[40px] rounded-md"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>
    </div>
  );
};

export { Ingredients, IngredientsSkeleton };
