import { OnboardingPageMobile } from "./OnboardingPage.mobile";

export function OnboardingPageTablet() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <OnboardingPageMobile />
      </div>
    </div>
  );
}
