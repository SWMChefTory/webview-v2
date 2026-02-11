import { TimerBottomSheet } from "@/src/widgets/timer/modal/ui/timerBottomSheet";
import { TimerButton } from "@/src/widgets/timer/button/ui/timerButton";
import { LoopSettingButton } from "./loopSettingButton";
import { MicButton, VoiceGuideModal, VoiceGuideMicStep } from "./micButton";
import { VoiceGuideTimerStep } from "./timerTutorialStep";
import type { RecipeStepControllerReturn } from "./RecipeStep.controller";

interface FloatingControlBarProps {
  controller: RecipeStepControllerReturn;
  isLandscape: boolean;
}

export function FloatingControlBar({
  controller,
  isLandscape,
}: FloatingControlBarProps) {
  const {
    recipe,
    analytics,
    isInRepeat,
    isListeningActive,
    isVoiceGuideOpen,
    timerErrorPopoverRef,
    micButtonPopoverRef,
    isInTutorial,
    handleLoopToggle,
    handleMicButtonClick,
    handleMicButtonClickWithTutorial,
    handleVoiceGuideClose,
  } = controller;

  const id = recipe.videoInfo.videoId;
  const recipeName = recipe.videoInfo.videoTitle;

  return (
    <div className="absolute flex flex-col bottom-[0] left-[0] right-[0] z-[20] pt-[10] pointer-events-none">
      {isLandscape ? (
        <div className="h-12 lg:h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      ) : (
        <div className="h-40 lg:h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      )}
      <div className="flex justify-between items-center bg-black pb-[30] px-[20] lg:px-8 lg:pb-8 pointer-events-auto">
        {isInTutorial ? (
          <VoiceGuideTimerStep
            trigger={
              <TimerButton
                recipeId={id}
                recipeName={recipeName}
                errorPopoverRef={timerErrorPopoverRef}
              />
            }
            recipeId={id}
          />
        ) : (
          <TimerBottomSheet
            trigger={
              <TimerButton
                recipeId={id}
                recipeName={recipeName}
                errorPopoverRef={timerErrorPopoverRef}
              />
            }
            recipeId={id}
            recipeName={recipeName}
            isDarkMode={true}
            isLandscape={isLandscape}
            onTriggerClick={() => analytics.recordTimerButtonTouch()}
          />
        )}
        <LoopSettingButton isRepeat={isInRepeat} onClick={handleLoopToggle} />
        {isInTutorial ? (
          <VoiceGuideMicStep
            trigger={
              <MicButton
                isActive={isListeningActive}
                ref={micButtonPopoverRef}
                onClick={handleMicButtonClickWithTutorial}
              />
            }
            recipeId={id}
          />
        ) : (
          <MicButton
            isActive={isListeningActive}
            ref={micButtonPopoverRef}
            onClick={handleMicButtonClick}
          />
        )}

        {isVoiceGuideOpen && (
          <VoiceGuideModal onClick={handleVoiceGuideClose} />
        )}
      </div>
    </div>
  );
}
