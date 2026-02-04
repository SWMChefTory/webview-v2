import { OnboardingPageMobile } from "./OnboardingPage.mobile";

export function OnboardingPageDesktop() {
  // Desktop Layout: Center the mobile view with a background
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-[420px] bg-white rounded-[40px] shadow-2xl overflow-hidden min-h-[800px] relative border-[8px] border-gray-900">
        {/* iPhone Notch Simulation */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-50" />
        <OnboardingPageMobile />
      </div>
    </div>
  );
}
