import { useState, useMemo, useCallback } from "react";
import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import { RecipeStep } from "../type/recipeSteps";

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
      if (stepIndex < 0 && stepIndex >= steps.length) {
        console.warn("잘못된 index 매개변수");
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
      for (let i = flatList.length - 1; i >= 0; i--) {
        if (time < flatList[i].start) {
          continue;
        }
        if (
          flatList[i].stepIndex !== currentIndex ||
          flatList[i].detailIndex !== currentDetailIndex
        ) {
          setCurrentIndex(flatList[i].stepIndex);
          setCurrentDetailIndex(flatList[i].detailIndex);
        }
        return;
      }
    },
    [steps, flatList]
  );

  return {
    steps,
    currentIndex,
    currentDetailIndex,
    changeStepByIndex,
    chageStepByTime,
  };
}
