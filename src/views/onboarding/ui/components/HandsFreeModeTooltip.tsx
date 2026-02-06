import * as Popover from "@radix-ui/react-popover";
import { Info, Mic, Search, Timer, CheckCircle, Repeat } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "motion/react";
import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";

/**
 * HandsFreeModeTooltip - 핸즈프리 요리모드 기능 설명 툴팁
 *
 * @description 온보딩 스텝 2에서 "핸즈프리 요리모드" 텍스트 옆에 표시되는 정보 툴팁
 * @features
 * - 호버/클릭 반응형 (모바일/데스크톱)
 * - 접근성 완벽 지원 (aria-label, 키보드 내비게이션)
 * - 매끄러운 애니메이션 (fadeIn/slideIn)
 * - 다크모드 대응
 * - i18n 지원
 * - 반응형 (mobile-first)
 */

interface FeatureItem {
  icon: React.ReactNode;
  titleKey: string;
  descriptionKey: string;
}

const featureList: FeatureItem[] = [
  {
    icon: <Mic className="w-5 h-5" />,
    titleKey: "tooltip.features.voiceCommand.title",
    descriptionKey: "tooltip.features.voiceCommand.description",
  },
  {
    icon: <Search className="w-5 h-5" />,
    titleKey: "tooltip.features.sceneSearch.title",
    descriptionKey: "tooltip.features.sceneSearch.description",
  },
  {
    icon: <Timer className="w-5 h-5" />,
    titleKey: "tooltip.features.timerControl.title",
    descriptionKey: "tooltip.features.timerControl.description",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    titleKey: "tooltip.features.ingredientCheck.title",
    descriptionKey: "tooltip.features.ingredientCheck.description",
  },
  {
    icon: <Repeat className="w-5 h-5" />,
    titleKey: "tooltip.features.loopMode.title",
    descriptionKey: "tooltip.features.loopMode.description",
  },
];

export function HandsFreeModeTooltip({
  className,
  side = "bottom",
  align = "center",
}: {
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}) {
  const { t } = useOnboardingTranslation();
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  return (
    <Popover.Root modal={false}>
      <Popover.Trigger
        className={cn(
          "inline-flex items-center justify-center",
          "rounded-full transition-all duration-200",
          "text-gray-400 hover:text-orange-500",
          "hover:bg-orange-50 active:bg-orange-100",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-orange-500 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          "group"
        )}
        aria-label={t("step2.tooltip.ariaLabel")}
      >
        <Info
          className={cn(
            "w-4 h-4 lg:w-5 lg:h-5",
            "transition-transform duration-200",
            "group-hover:scale-110 group-active:scale-95"
          )}
          strokeWidth={2.5}
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side={side}
          align={align}
          sideOffset={8}
          alignOffset={0}
          collisionPadding={24}
          avoidCollisions
          className={cn(
            "z-50 w-[calc(100vw-1rem)] max-w-[320px] sm:max-w-[360px] md:max-w-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2"
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Tooltip Container */}
          <motion.div
            initial={{ opacity: 0, y: side === "top" ? 8 : -8 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
                duration: shouldAnimate ? 0.2 : 0,
              },
            }}
            exit={{
              opacity: 0,
              y: side === "top" ? 8 : -8,
              transition: { duration: shouldAnimate ? 0.15 : 0 },
            }}
            className={cn(
              "relative overflow-hidden",
              "rounded-xl lg:rounded-2xl",
              "bg-white dark:bg-gray-800",
              "shadow-xl lg:shadow-2xl",
              "border border-gray-200 dark:border-gray-700",
              "backdrop-blur-sm",
              "max-h-[50vh] sm:max-h-none",
              "overflow-y-auto"
            )}
          >
            {/* Decorative gradient accent */}
            <div
              className={cn(
                "absolute top-0 left-0 right-0 h-1",
                "bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"
              )}
              aria-hidden="true"
            />

            {/* Content */}
            <div className="p-3 sm:p-4 lg:p-5">
              {/* Header */}
              <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                {/* Icon */}
                <div
                  className={cn(
                    "flex-shrink-0 flex items-center justify-center",
                    "w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12",
                    "rounded-xl",
                    "bg-gradient-to-br from-orange-50 to-orange-100",
                    "dark:from-orange-900/30 dark:to-orange-800/30",
                    "border border-orange-200 dark:border-orange-700"
                  )}
                  aria-hidden="true"
                >
                  <Mic
                    className={cn(
                      "w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6",
                      "text-orange-600 dark:text-orange-400"
                    )}
                    strokeWidth={2.5}
                  />
                </div>

                {/* Title & Description */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "text-sm sm:text-base lg:text-lg font-bold",
                      "text-gray-900 dark:text-gray-100",
                      "mb-1 sm:mb-1.5"
                    )}
                  >
                    {t("step2.tooltip.title")}
                  </h3>
                  <p
                    className={cn(
                      "text-xs sm:text-sm leading-relaxed",
                      "text-gray-600 dark:text-gray-400",
                      "break-keep"
                    )}
                  >
                    {t("step2.tooltip.description")}
                  </p>
                </div>
              </div>

              {/* Feature List */}
              <div className="space-y-2 sm:space-y-2.5 lg:space-y-3">
                {featureList.map((feature, index) => (
                  <motion.div
                    key={feature.titleKey}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        delay: shouldAnimate ? index * 0.05 : 0,
                        duration: 0.2,
                      },
                    }}
                    className={cn(
                      "flex items-start gap-2 sm:gap-3",
                      "p-2 sm:p-2.5 lg:p-3",
                      "rounded-lg",
                      "bg-gray-50 dark:bg-gray-900/50",
                      "hover:bg-gray-100 dark:hover:bg-gray-900",
                      "transition-colors duration-150"
                    )}
                  >
                    {/* Feature Icon */}
                    <div
                      className={cn(
                        "flex-shrink-0 flex items-center justify-center",
                        "w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9",
                        "rounded-lg",
                        "bg-white dark:bg-gray-800",
                        "shadow-sm",
                        "text-orange-600 dark:text-orange-400",
                        "border border-gray-200 dark:border-gray-700"
                      )}
                      aria-hidden="true"
                    >
                      {feature.icon}
                    </div>

                    {/* Feature Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-[11px] sm:text-xs lg:text-sm font-semibold",
                          "text-gray-900 dark:text-gray-100",
                          "mb-0.5"
                        )}
                      >
                        {t(`step2.${feature.titleKey}`)}
                      </p>
                      <p
                        className={cn(
                          "text-[10px] sm:text-[11px] lg:text-xs",
                          "text-gray-600 dark:text-gray-400",
                          "leading-snug break-keep"
                        )}
                      >
                        {t(`step2.${feature.descriptionKey}`)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Close hint */}
              <div
                className={cn(
                  "mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700",
                  "flex items-center justify-center gap-1 sm:gap-1.5",
                  "text-[10px] sm:text-[11px] lg:text-xs",
                  "text-gray-500 dark:text-gray-400"
                )}
              >
                <span>{t("step2.tooltip.closeHint")}</span>
              </div>
            </div>

            {/* Arrow */}
            <Popover.Arrow className="fill-white dark:fill-gray-800 drop-shadow-sm" />
          </motion.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/**
 * Compact variant for tight spaces
 */
export function HandsFreeModeTooltipCompact({
  className,
}: {
  className?: string;
}) {
  return (
    <HandsFreeModeTooltip
      className={className}
      side="bottom"
      align="center"
    />
  );
}

/**
 * Inline variant for text flow integration
 */
export function HandsFreeModeTooltipInline({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {children}
      <HandsFreeModeTooltipCompact />
    </span>
  );
}
