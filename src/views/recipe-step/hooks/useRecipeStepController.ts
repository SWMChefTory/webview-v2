import { useState, useMemo, useCallback, useRef } from "react";
import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import { RecipeStep } from "../type/recipeSteps";
import { checkStepIndex } from "../utils/checkStepIndex";
import { useRecipeStepTranslation } from "./useRecipeStepTranslation";

const INTRO = "INTRO";

/**
 * 현재 위치를 나타내는 인터페이스
 * stepIndex와 detailIndex를 원자적으로 업데이트하기 위해 단일 객체로 관리
 */
interface CurrentPosition {
  stepIndex: number;
  detailIndex: number;
}

// 수동 내비게이션 후 일정 시간 동안 시간 기반 업데이트를 방지하기 위한 지연 시간
const MANUAL_NAVIGATION_DEBOUNCE_MS = 300;

export function useRecipeStepController({ recipeId }: { recipeId: string }) {
  const { data: recipe } = useFetchRecipe(recipeId);
  const { t } = useRecipeStepTranslation();

  // 두 상태를 별도로 관리하면 스텝 변경 시 일시적으로 불일치 상태가 발생하여
  // 프로그래스바가 깜빡이는 문제가 있음. 단일 객체로 관리하여 원자적 업데이트 보장.
  const [position, setPosition] = useState<CurrentPosition>({
    stepIndex: 0,
    detailIndex: 0,
  });

  // 수동 내비게이션 중임을 추적하는 플래그 (레이스 컨디션 방지)
  const isManualNavigationRef = useRef(false);

  const steps: RecipeStep[] = useMemo(() => {
    const _steps = recipe.recipeSteps?.map((step) => {
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
        subtitle: t("intro"),
        details: [{ start: 0, text: t("intro") }],
      },
      ..._steps,
    ].sort((e1, e2) => {
      return e1.stepOrder - e2.stepOrder;
    });
  }, [recipeId, t]);

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

      if (process.env.NODE_ENV === 'development') {
        console.log(`[changeStepByIndex] MANUAL: ${position.stepIndex}→${stepIndex}, detail ${position.detailIndex}→${stepDetailIndex}`);
      }

      // 수동 내비게이션 플래그 설정
      isManualNavigationRef.current = true;

      // 두 상태를 동시에 업데이트하여 중간 상태 방지
      setPosition({ stepIndex, detailIndex: stepDetailIndex });

      // 일정 시간 후 플래그 해제 (비디오 seek이 완료된 후 시간 업데이트 허용)
      setTimeout(() => {
        isManualNavigationRef.current = false;
        if (process.env.NODE_ENV === 'development') {
          console.log(`[changeStepByIndex] Manual navigation flag released`);
        }
      }, MANUAL_NAVIGATION_DEBOUNCE_MS);
    },
    [steps, position]
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
      // 수동 내비게이션 중이면 시간 기반 업데이트 스킵 (레이스 컨디션 방지)
      if (isManualNavigationRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[chageStepByTime] SKIPPED (manual navigation active), time=${time}`);
        }
        return;
      }

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

        // 바운드 체크: 한 번에 2개 이상의 스텝을 넘어가면 무시 (바이너리 서치 오류 방지)
        const stepDiff = Math.abs(item.stepIndex - position.stepIndex);
        if (stepDiff > 2) {
          // 너무 큰 점프는 의도치 않은 동작일 가능성이 높으므로 무시
          console.warn(
            `[RecipeStep] Binary search attempted large jump: ${position.stepIndex} → ${item.stepIndex}, ignoring`
          );
          return;
        }

        if (
          item.stepIndex !== position.stepIndex ||
          item.detailIndex !== position.detailIndex
        ) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[chageStepByTime] UPDATING: ${position.stepIndex}→${item.stepIndex}, detail ${position.detailIndex}→${item.detailIndex}, time=${time}`);
          }
          // 두 상태를 동시에 업데이트하여 프로그래스바 깜빡임 방지
          setPosition({
            stepIndex: item.stepIndex,
            detailIndex: item.detailIndex,
          });
        }
      }
    },
    [steps, flatList, position]
  );

  // 기존 API와 호환성을 유지하기 위해 개별 값으로 반환
  return {
    steps,
    currentIndex: position.stepIndex,
    currentDetailIndex: position.detailIndex,
    changeStepByIndex,
    chageStepByTime,
  };
}
