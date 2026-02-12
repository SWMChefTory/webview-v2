import { useState, useRef, useLayoutEffect } from "react";
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
  const [showAll, setShowAll] = useState(false);
  const [overflow, setOverflow] = useState<{
    is: boolean;
    count: number;
    height: number;
  }>({ is: false, count: 0, height: 0 });
  const chipContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const showAllRef = useRef(showAll);
  showAllRef.current = showAll;
  const { t } = useRecipeDetailTranslation();

  // 칩 컨테이너의 실제 렌더링 높이를 측정하여 2줄 초과 시 오버플로우 감지
  useLayoutEffect(() => {
    const container = chipContainerRef.current;
    if (!container) return;

    const measure = () => {
      // ResizeObserver 피드백 루프 방지를 위해 일시 해제
      observerRef.current?.disconnect();

      // 측정을 위해 제약 일시 제거
      const savedMaxHeight = container.style.maxHeight;
      const savedOverflow = container.style.overflow;
      container.style.maxHeight = "none";
      container.style.overflow = "visible";

      // 강제 레이아웃 재계산
      void container.offsetHeight;

      const chips = Array.from(container.children) as HTMLElement[];
      if (chips.length === 0) {
        container.style.maxHeight = "";
        container.style.overflow = "";
        observerRef.current?.observe(container);
        return;
      }

      // getBoundingClientRect로 정확한 행 위치 그룹핑
      const containerTop = container.getBoundingClientRect().top;
      const rowMap = new Map<number, number>();

      for (const chip of chips) {
        const relTop = Math.round(
          chip.getBoundingClientRect().top - containerTop
        );
        rowMap.set(relTop, (rowMap.get(relTop) ?? 0) + 1);
      }

      const sortedTops = [...rowMap.keys()].sort((a, b) => a - b);

      if (sortedTops.length <= 2) {
        // 2줄 이내 — 오버플로우 없음
        container.style.maxHeight = "";
        container.style.overflow = "";
        setOverflow((prev) =>
          prev.is === false ? prev : { is: false, count: 0, height: 0 }
        );
      } else {
        // 2번째 줄의 하단을 기준으로 높이 계산
        const row2Top = sortedTops[1];
        const row2Chip = chips.find(
          (c) =>
            Math.round(c.getBoundingClientRect().top - containerTop) ===
            row2Top
        )!;
        const twoRowHeight = Math.round(
          row2Chip.getBoundingClientRect().bottom - containerTop
        );

        // 3줄 이상에 있는 숨겨진 칩 개수
        const hiddenCount = sortedTops
          .slice(2)
          .reduce((sum, top) => sum + (rowMap.get(top) ?? 0), 0);

        setOverflow((prev) =>
          prev.is === true &&
          prev.count === hiddenCount &&
          prev.height === twoRowHeight
            ? prev
            : { is: true, count: hiddenCount, height: twoRowHeight }
        );

        // 현재 showAll 상태에 따라 제약 적용
        if (!showAllRef.current) {
          container.style.maxHeight = `${twoRowHeight}px`;
          container.style.overflow = "hidden";
        } else {
          container.style.maxHeight = "";
          container.style.overflow = "";
        }
      }

      // 옵저버 재연결
      observerRef.current?.observe(container);
    };

    const observer = new ResizeObserver(measure);
    observerRef.current = observer;
    measure();
    observer.observe(container);

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [ingredients]);

  // showAll 토글 시 컨테이너 스타일 적용
  useLayoutEffect(() => {
    const container = chipContainerRef.current;
    if (!container) return;

    if (showAll || !overflow.is) {
      container.style.maxHeight = "";
      container.style.overflow = "";
    } else if (overflow.height > 0) {
      container.style.maxHeight = `${overflow.height}px`;
      container.style.overflow = "hidden";
    }
  }, [showAll, overflow]);

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
      <div ref={chipContainerRef} className="flex flex-wrap gap-1">
        {ingredients.map((ingredient, index) => (
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
      {overflow.is && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center gap-1 py-2 text-sm text-gray-600 font-medium
            transition-colors duration-150
            hover:text-gray-900
            active:text-gray-900
            cursor-pointer"
        >
          {showAll ? (
            <>
              {t("ingredients.showLess")}
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              {t("ingredients.showAll")}
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                +{overflow.count}
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
