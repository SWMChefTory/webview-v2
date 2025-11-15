/* =====================================================================================
   진행바 (그룹 단위, 부드러운 채움)
===================================================================================== */
export function ProgressBar({
    steps,
    currentTime,
    videoSeconds,
    orientation = "portrait",
  }: {
    steps: StepItem[];
    currentTime: number;
    videoSeconds?: number;
    orientation?: "portrait" | "landscape";
  }) {
    const safeVideoSeconds =
      typeof videoSeconds === "number" && videoSeconds > 0 ? videoSeconds : null;
  
    const segments = useMemo(() => {
      return steps.map((step, stepIndex) => {
        const stepStart = step.details[0]?.start ?? 0;
        const isLast = stepIndex === steps.length - 1;
  
        const stepEnd = isLast
          ? safeVideoSeconds ?? stepStart + 10
          : steps[stepIndex + 1].details[0]?.start ?? stepStart + 10;
  
        const clamped = Math.min(Math.max(currentTime, stepStart), stepEnd);
        const denom = stepEnd - stepStart;
        const ratio = denom <= 0 ? 0 : (clamped - stepStart) / denom;
  
        const isCompleted = denom > 0 && currentTime >= stepEnd;
        const isCurrent =
          denom > 0 && currentTime >= stepStart && currentTime < stepEnd;
  
        return {
          progress: isCompleted ? 1 : isCurrent ? ratio : 0,
          isCompleted,
          isCurrent,
        };
      });
    }, [steps, currentTime, safeVideoSeconds]);
  
    if (orientation === "landscape") {
      return (
        <div className="h-full w-1.5">
          <div className="flex h-full w-1.5 flex-col gap-1">
            {segments.map((seg, i) => (
              <div
                key={i}
                className="relative h-full w-full overflow-hidden rounded-full bg-white/20"
              >
                <div
                  className={`absolute bottom-0 left-0 w-full rounded-full will-change-[height] ${
                    seg.isCompleted || seg.isCurrent ? "bg-white" : "bg-white/0"
                  } ${
                    seg.isCurrent
                      ? "transition-[height] duration-500 ease-out"
                      : ""
                  }`}
                  style={{ height: `${seg.progress * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
  
    return (
      <div className="w-full">
        <div className="flex h-1.5 w-full gap-1">
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
      </div>
    );
  }
  