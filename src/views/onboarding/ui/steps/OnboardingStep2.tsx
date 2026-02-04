import { useTranslation } from "next-i18next";
import { StepContainer } from "../components/StepContainer";
import { MicButton, VoiceGuideModal } from "@/src/views/recipe-step/ui/micButton";
import { usePreventBack } from "../../hooks/usePreventBack";
import { useOnboardingStore } from "../../stores/useOnboardingStore";

export function OnboardingStep2() {
  const { t } = useTranslation("onboarding");
  const { nextStep, currentStep, goToStep, completeOnboarding } = useOnboardingStore();
  
  // Prevent back button
  usePreventBack();
  
  const [isVoiceGuideOpen, setIsVoiceGuideOpen] = useState(false);
  const [showMicTutorial, setShowMicTutorial] = useState(true);
  const [hasClickedMic, setHasClickedMic] = useState(false);
  
  const handleMicButtonClick = () => {
    setShowMicTutorial(false);
    setHasClickedMic(true);
    track(AMPLITUDE_EVENT.ONBOARDING_HANDSFREE_CLICK);
    
    setTimeout(() => {
      setIsVoiceGuideOpen(true);
    }, 3000);
  };
  
  const handleVoiceGuideClose = () => {
    setIsVoiceGuideOpen(false);
  };
  
  const handleNext = () => {
    if (currentStep < 3) {
      track(AMPLITUDE_EVENT.ONBOARDING_STEP_CHANGE, {
        step_from: currentStep,
        step_to: currentStep + 1
      });
      track(AMPLITUDE_EVENT.ONBOARDING_STEP_COMPLETE, {
        step: currentStep,
        step_count: 3
      });
      nextStep();
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 1) {
      track(AMPLITUDE_EVENT.ONBOARDING_STEP_CHANGE, {
        step_from: currentStep,
        step_to: currentStep - 1
      });
      goToStep(currentStep - 1 as 1 | 2 | 3);
    }
  };
  
  const handleSkip = () => {
    track(AMPLITUDE_EVENT.ONBOARDING_SKIP);
    completeOnboarding();
    window.location.href = '/';
  };
  
  return (
    <StepContainer
      currentStep={currentStep}
      onNext={handleNext}
      onPrev={handlePrev}
      onSkip={handleSkip}
    >
      <div className="text-center w-full max-w-md mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {t('step2.title')}
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          {t('step2.subtitle')}
        </p>
        
        {/* Value Proposition */}
        <div className="mb-8 bg-orange-50 rounded-xl p-4 text-orange-800 font-medium">
          <p className="text-lg">
            {t('step2.value')}
          </p>
        </div>
        
        {/* Mic Button Area with Background Image */}
        <div className="relative w-64 lg:w-72 mx-auto mb-10 rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
          {/* Background Image (Recipe Detail) */}
          <img 
            src="/images/onboarding/app-recipe.png" 
            alt="Recipe Detail" 
            className="w-full h-auto opacity-90"
          />
          
          {/* Overlay Gradient for better visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Mic Button Positioned at Bottom Right (Simulating FAB) */}
          <div className="absolute bottom-6 right-6 flex flex-col items-center justify-center">
            {/* Pulse Animation Background */}
            {!hasClickedMic && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-orange-500/40 rounded-full animate-ping pointer-events-none" />
            )}

            {/* Mic Button */}
            <div className="relative z-10 transform scale-90">
              <MicButton
                isActive={hasClickedMic && !isVoiceGuideOpen}
                onClick={handleMicButtonClick}
                ref={undefined}
              />
            </div>
            
            {/* Tutorial Tooltip */}
            {showMicTutorial && !hasClickedMic && (
              <div className="absolute bottom-full mb-4 right-0 bg-orange-600 text-white px-3 py-1.5 rounded-lg shadow-lg animate-bounce whitespace-nowrap z-20">
                <p className="font-bold text-xs">
                  {t('step2.tryNow')} 👇
                </p>
                <div className="absolute -bottom-1 right-6 w-2 h-2 bg-orange-600 rotate-45" />
              </div>
            )}
          </div>
          
          {/* Feedback Text Overlay */}
          {hasClickedMic && !isVoiceGuideOpen && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <p className="text-white font-bold text-xl animate-pulse">
                듣고 있어요...
              </p>
            </div>
          )}
        </div>
        
        {/* Voice Commands Info */}
        <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
          {['재생', '다음 단계', '타임스탬프'].map((cmd) => (
            <div
              key={cmd}
              className="p-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700"
            >
              "{cmd}"
            </div>
          ))}
        </div>
        
        {/* Voice Guide Modal */}
        {isVoiceGuideOpen && (
          <VoiceGuideModal onClick={handleVoiceGuideClose} />
        )}
      </div>
    </StepContainer>
  );
}
