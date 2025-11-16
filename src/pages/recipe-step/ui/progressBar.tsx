import { RecipeStep } from "../type/recipeSteps";
import { motion, useMotionValue, useTransform } from "framer-motion";

export function ProgressBar({
  steps,
  currentStepIndex,
  currentDetailStepIndex,
  onClick,
  isLandscape,
}: {
  steps: RecipeStep[];
  currentStepIndex: number;
  currentDetailStepIndex: number;
  onClick: ({
    stepIndex,
    stepDetailIndex,
  }: {
    stepIndex: number;
    stepDetailIndex: number;
  }) => void;
  isLandscape: boolean;
}) {
  // console.log(currentStepIndex,"!!!!!!!!!!");
  const progressBarWidth =
    (currentStepIndex / steps.length) * 100 +
    ((currentDetailStepIndex + 1) /
      steps[currentStepIndex].details.length /
      steps.length) *
      100;

  return (
    <div className="w-full">
      <div className="h-2" />
      <div className="relative bg-white/30 w-full h-[10]">
        <motion.div
          className="relative bg-white/80  h-[10px]"
          animate={{ width: `${progressBarWidth}%` }}
          transition={{ duration: 0.2 }}
        />
        <div className="absolute left-[0] right-[0] top-[0] flex h-[10]">
          {Array.from({ length: steps.length }).map((_, stepIndex) => {
            return (
              <Step
                onClick={({ stepDetailIndex }: { stepDetailIndex: number }) => {
                  onClick({ stepIndex, stepDetailIndex });
                }}
                detailCount={steps[stepIndex].details.length}
                key={stepIndex}
              />
            );
          })}
        </div>
      </div>
      <div className="h-4" />
    </div>
  );
}

function Step({
  onClick,
  detailCount,
}: {
  onClick: ({ stepDetailIndex }: { stepDetailIndex: number }) => void;
  detailCount: number;
}) {
  if (detailCount <= 0) {
    throw new Error("0보다 작은 값은 detailCount가 될 수 없습니다.");
  }
  return (
    <div
      className="flex-1 flex justify-between z-[100]"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        if (rect.width === 0 || detailCount === 0) return;

        const ratio = Math.max(
          0,
          Math.min(1, (e.clientX - rect.left) / rect.width)
        );
        const oneRatio = 1 / detailCount;
        const stepDetailIndex = Math.min(
          Math.floor(ratio / oneRatio),
          detailCount - 1
        );

        onClick({ stepDetailIndex });
      }}
    >
      <StepIntervalStart />
      <StepIntervalEnd />
    </div>
  );
}

function StepIntervalEnd({ width = 4, height = 10 }) {
  const rx = 3;
  const ry = height / 2;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path
        d={`
            M 0,0
            A ${rx} ${ry} 0 0 1 0,${height}
            L ${width},${height}
            L ${width},0
            Z
          `}
        fill="#000"
      />
    </svg>
  );
}

function StepIntervalStart({ width = 4, height = 10 }) {
  const rx = 3;
  const ry = height / 2;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path
        d={`
            M 0,0
            L ${width},0
            A ${rx} ${ry} 0 0 0 ${width},${height}
            L 0,${height}
            Z
          `}
        fill="#000"
      />
    </svg>
  );
}
//   const segments = useMemo(() => {
//     return steps.map((step, stepIndex) => {
//       const stepStart = step.details[0]?.start ?? 0;
//       const isLast = stepIndex === steps.length - 1;

//       const stepEnd = isLast
//         ? safeVideoSeconds ?? stepStart + 10
//         : steps[stepIndex + 1].details[0]?.start ?? stepStart + 10;

//       const clamped = Math.min(Math.max(currentTime, stepStart), stepEnd);
//       const denom = stepEnd - stepStart;
//       const ratio = denom <= 0 ? 0 : (clamped - stepStart) / denom;

//       const isCompleted = denom > 0 && currentTime >= stepEnd;
//       const isCurrent =
//         denom > 0 && currentTime >= stepStart && currentTime < stepEnd;

//       return {
//         progress: isCompleted ? 1 : isCurrent ? ratio : 0,
//         isCompleted,
//         isCurrent,
//       };
//     });
//   }, [steps, currentTime, safeVideoSeconds]);

//   if (orientation === "landscape") {
//     return (
//       <div className="h-full w-1.5">
//         <div className="flex h-full w-1.5 flex-col gap-1">
//           {segments.map((seg, i) => (
//             <div
//               key={i}
//               className="relative h-full w-full overflow-hidden rounded-full bg-white/20"
//             >
//               <div
//                 className={`absolute bottom-0 left-0 w-full rounded-full will-change-[height] ${
//                   seg.isCompleted || seg.isCurrent ? "bg-white" : "bg-white/0"
//                 } ${
//                   seg.isCurrent
//                     ? "transition-[height] duration-500 ease-out"
//                     : ""
//                 }`}
//                 style={{ height: `${seg.progress * 100}%` }}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

{
  /* <div className="w-full">
      <div className="flex h-1.5 w-full">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="relative h-full flex-1 overflow-hidden rounded-full bg-white/20"
          >
            <div
              className={`absolute inset-y-0 left-0 rounded-full will-change-[width] ${
                seg.isCompleted || seg.isCurrent ? "bg-white" : "bg-white/0"
              } ${
                seg.isCurrent ? "transition-[width] duration-500 ease-out" : ""
              }`}
              style={{ width: `${seg.progress * 100}%` }}
            />
          </div>
        ))}
      </div>
    </div> */
}
