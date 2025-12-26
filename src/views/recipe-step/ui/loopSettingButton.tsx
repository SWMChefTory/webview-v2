import { useRecipeStepTranslation } from "../hooks/useRecipeStepTranslation";

export const LoopSettingButton = ({
  isRepeat,
  onClick,
}: {
  isRepeat: boolean;
  onClick: () => void;
}) => {
  const { t } = useRecipeStepTranslation();
  return (
    <div className="flex flex-col justify-between items-center">
      <button
        className={[
          "relative flex h-14 w-14 items-center justify-center rounded-full p-2 transition active:scale-95 shadow-[0_2px_16px_rgba(0,0,0,0.32)]",
          isRepeat
            ? "bg-gradient-to-b from-orange-600 to-orange-500 ring-2 ring-orange-300 shadow-orange-300/40"
            : "bg-gradient-to-b from-neutral-700 to-neutral-600",
        ].join(" ")}
        onClick={(e) => {
          onClick();
        }}
        aria-label={isRepeat ? t("loop.ariaOn") : t("loop.ariaOff")}
        aria-pressed={isRepeat}
        type="button"
        title={isRepeat ? t("loop.ariaOn") : t("loop.ariaOff")}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="17 1 21 5 17 9"></polyline>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
          <polyline points="7 23 3 19 7 15"></polyline>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
        </svg>
        {!isRepeat && (
          <svg
            className="pointer-events-none absolute inset-0 m-auto"
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
          >
            <line
              x1="10"
              y1="34"
              x2="34"
              y2="10"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}
        {isRepeat && (
          <span className="pointer-events-none absolute inset-0 rounded-full animate-[pulse_2.4s_ease-in-out_infinite] shadow-[0_0_0_0_rgba(251,146,60,0.45)]" />
        )}
      </button>
      <div className="text-gray-500 pt-1">
        {t("loop.label")}
      </div>
    </div>
  );
};
