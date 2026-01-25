import Header, { BackButton } from "@/src/shared/ui/header/header";
import { Video } from "./video";
import { ProgressBar } from "./progressBar";
import { StepsContent } from "./stepsContent";
import { TutorialStarter } from "./tutorialStarter";
import { FloatingControlBar } from "./RecipeStep.common";
import type { RecipeStepControllerReturn } from "./RecipeStep.controller";

interface RecipeStepMobileProps {
  controller: RecipeStepControllerReturn;
}

export function RecipeStepMobile({ controller }: RecipeStepMobileProps) {
  const {
    router,
    recipe,
    isInRepeat,
    videoRef,
    steps,
    currentIndex,
    currentDetailIndex,
    chageStepByTime,
    handleChangeStepWithVideoTime,
    handleRepeatInGroup,
    handleTrackTouchNavigation,
  } = controller;

  const id = recipe.videoInfo.id;

  return (
    <div className="flex flex-col w-[100vw] h-[100vh] overflow-hidden bg-black items-center lg:max-w-[1920px] lg:mx-auto">
      <TutorialStarter recipeId={id} />
      <Header
        leftContent={
          <BackButton
            onClick={() => {
              router.back();
            }}
            color="text-white"
          />
        }
      />
      <Video
        videoId={recipe.videoInfo.id}
        title={recipe.videoInfo.videoTitle}
        ref={videoRef}
        onInternallyChangeTime={
          isInRepeat ? handleRepeatInGroup : chageStepByTime
        }
        isLandscape={false}
      />
      <ProgressBar
        steps={steps}
        currentDetailStepIndex={currentDetailIndex}
        currentStepIndex={currentIndex}
        isLandscape={false}
        onClick={handleChangeStepWithVideoTime}
        onTrackTouchNavigation={handleTrackTouchNavigation}
      />
      <div className="relative overflow-hidden">
        <StepsContent
          currentDetailStepIndex={currentDetailIndex}
          currentStepIndex={currentIndex}
          onChangeStep={handleChangeStepWithVideoTime}
          steps={steps}
          isLandscape={false}
          recipeId={id}
          onTrackTouchNavigation={handleTrackTouchNavigation}
        />
        <FloatingControlBar controller={controller} isLandscape={false} />
      </div>
    </div>
  );
}
