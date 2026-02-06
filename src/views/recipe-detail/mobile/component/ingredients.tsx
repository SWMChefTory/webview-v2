import { useState } from "react";
import { IngredientPurchaseModal } from "../../common/component/IngredientPurchaseModal";
import { Ingredient } from "../../common/hook/useRecipeDetailController";

const Ingredients = ({
  ingredients,
  recipeId,
}: {
  ingredients: Ingredient[];
  recipeId: string;
}) => {
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  return (
    <div id="ingredients-section" className="px-3 gap-2">
      <div className="text text-lg font-bold px-1">재료</div>
      <div className="h-2" />
      <div className="flex flex-wrap gap-1">
        {ingredients.map((ingredient, index) => (
          <div
            className="inline-flex w-fit shrink-0 rounded-md border px-3 py-2"
            key={index}
          >
            <div className="text-center">
              <div className="font-semibold">{ingredient.name}</div>
              <div className="text-gray-500 text-sm">
                {ingredient.amount || "영상참고"}
                {`${ingredient.unit ? ` ${ingredient.unit}` : ""}`}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center px-2 py-4">
        <button
          type="button"
          onClick={() => setPurchaseModalOpen(true)}
          className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-xl shadow-md
              transition-all duration-150
              hover:from-orange-500 hover:to-orange-600 hover:shadow-lg
              active:scale-[0.97] active:shadow-sm
              cursor-pointer"
        >
          🛒 영상 속 재료 바로 구매하기
        </button>
      </div>
      <div className="h-1" />

      <IngredientPurchaseModal
        open={purchaseModalOpen}
        onOpenChange={setPurchaseModalOpen}
        ingredients={ingredients}
        recipeId={recipeId}
      />
    </div>
  );
};

export { Ingredients };
