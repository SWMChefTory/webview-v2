import { useState, useMemo, useCallback } from "react";
import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import { RecipeStep } from "../type/recipeSteps";
import { checkStepIndex } from "../utils/checkStepIndex";

const INTRO = "INTRO";

export function useRecipeStepController({ recipeId }: { recipeId: string }) {
  const { data: recipe } = useFetchRecipe(recipeId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0);

  const steps: RecipeStep[] = useMemo(() => {
    const _steps = recipe.steps?.map((step) => {
      return {
        id: step.id,
        stepOrder: step.stepOrder,
        subtitle: step.subtitle, // subtle → subtitle
        details: step.details
          .map((detail) => {
            return { text: detail.text, start: detail.start };
          })
          .sort((e1, e2) => {
            return e1.start - e2.start;
          }),
      };
    });
    console.log("!!!!!!!!!!!!!!!!",JSON.stringify(_steps));
    if (!_steps) {
      return [];
    }
    return [
      {
        id: INTRO,
        stepOrder: -1,
        subtitle: "인트로",
        details: [{ start: 0, text: "인트로" }],
      },
      ..._steps,
    ].sort((e1, e2) => {
      return e1.stepOrder - e2.stepOrder;
    });
  }, [recipeId]);

  const changeStepByIndex = useCallback(
    ({
      stepIndex,
      stepDetailIndex,
    }: {
      stepIndex: number;
      stepDetailIndex: number;
    }) => {
      if (!checkStepIndex({ steps, stepIndex, stepDetailIndex })) {
        return;
      }
      setCurrentIndex(stepIndex);
      setCurrentDetailIndex(stepDetailIndex);
    },
    [steps]
  );

  //TODO: 쓸 일 없으면 time 생성할 때 함께 만들기
  const flatList = useMemo(() => {
    return steps.flatMap((step, stepIndex) => {
      return step.details.map((detail, detailIndex) => {
        return {
          stepIndex,
          detailIndex: detailIndex,
          subtitle: detail.text,
          start: detail.start,
        };
      });
    });
  }, [steps]);

  const chageStepByTime = useCallback(
    (time: number) => {
      let left = 0;
      let right = flatList.length - 1;
      let result = -1;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (flatList[mid].start <= time) {
          result = mid;
          left = mid + 1; // 더 큰 인덱스 찾기
        } else {
          right = mid - 1;
        }
      }

      if (result !== -1) {
        const item = flatList[result];
        if (
          item.stepIndex !== currentIndex ||
          item.detailIndex !== currentDetailIndex
        ) {
          setCurrentIndex(item.stepIndex);
          setCurrentDetailIndex(item.detailIndex);
        }
      }
    },
    [steps, flatList, currentIndex, currentDetailIndex]
  );

  return {
    steps,
    currentIndex,
    currentDetailIndex,
    changeStepByIndex,
    chageStepByTime,
  };
}
