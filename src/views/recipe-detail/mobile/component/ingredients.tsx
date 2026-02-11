import { useState } from "react";
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
  const { t } = useRecipeDetailTranslation();

  return (
    <div id="ingredients-section" className="px-3 gap-2">
      <h2 className="text text-lg font-bold px-1">{t("tabs.ingredients")}</h2>
      <div className="h-2" />
      <div className="flex flex-wrap gap-1">
        {ingredients.map((ingredient, index) => (
          <div
            className="inline-flex w-fit shrink-0 rounded-md border px-2 py-1"
            key={index}
          >
            <div className="text-center">
              <div className="font-semibold text-sm">{ingredient.name}</div>
              <div className="text-gray-500 text-sm">
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
      <div className="w-full flex justify-center px-2 pt-3 pb-2">
        <button
          type="button"
          onClick={() => setPurchaseModalOpen(true)}
          className="flex items-center px-6 h-9 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-lg shadow-md
              transition-all duration-150
              hover:from-orange-500 hover:to-orange-600 hover:shadow-lg
              active:scale-[0.97] active:shadow-sm
              cursor-pointer"
        >
          {t("ingredients.purchase")}
        </button>
      </div>

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
    <div className="px-3 gap-2">
      <div className="w-[30%]"><TextSkeleton fontSize="text-lg" /></div>
      <div className="h-2" />
      <div className="flex flex-wrap gap-1">
        {[80, 64, 96, 56, 72, 88].map((w, i) => (
          <Skeleton
            key={i}
            className="h-[50px] rounded-md"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>
      <div className="w-full flex justify-center px-2 pt-3 pb-2">
        <Skeleton className="h-9 w-56 rounded-lg" />
      </div>
      <div className="h-1" />
    </div>
  );
};

export { Ingredients, IngredientsSkeleton };
