import { Video } from "./video";
import { ProgressBar } from "./progressBar";
import { StepsContent } from "./stepsContent";
import { TutorialStarter } from "./tutorialStarter";
import { FloatingControlBar } from "./RecipeStep.common";
import type { RecipeStepControllerReturn } from "./RecipeStep.controller";
import { useRouter } from "next/router";

interface RecipeStepDesktopProps {
  controller: RecipeStepControllerReturn;
}

export function RecipeStepDesktop({ controller }: RecipeStepDesktopProps) {
  const router = useRouter();
  const {
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
    <div className="flex flex-row w-full h-screen overflow-hidden bg-black items-center lg:max-w-[1920px] lg:mx-auto relative">
      <button
        onClick={() => router.back()}
        className="absolute top-8 left-8 z-50 w-14 h-14 flex items-center justify-center bg-black/40 hover:bg-white/10 hover:scale-110 active:scale-95 rounded-full text-white backdrop-blur-md transition-all duration-300 border border-white/20 shadow-2xl group"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      <TutorialStarter recipeId={id} />
      <Video
        videoId={recipe.videoInfo.id}
        title={recipe.videoInfo.videoTitle}
        ref={videoRef}
        onInternallyChangeTime={
          isInRepeat ? handleRepeatInGroup : chageStepByTime
        }
        isLandscape={true}
      />
      <ProgressBar
        steps={steps}
        currentDetailStepIndex={currentDetailIndex}
        currentStepIndex={currentIndex}
        isLandscape={true}
        onClick={handleChangeStepWithVideoTime}
        onTrackTouchNavigation={handleTrackTouchNavigation}
      />
      <div className="relative overflow-hidden h-screen">
        <StepsContent
          currentDetailStepIndex={currentDetailIndex}
          currentStepIndex={currentIndex}
          onChangeStep={handleChangeStepWithVideoTime}
          steps={steps}
          isLandscape={true}
          recipeId={id}
          onTrackTouchNavigation={handleTrackTouchNavigation}
        />
        <FloatingControlBar controller={controller} isLandscape={true} />
      </div>
    </div>
  );
}
