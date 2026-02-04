import { OnboardingPageMobile, OnboardingPageTablet, OnboardingPageDesktop } from "./ui";
import { useOnboardingStore } from "./stores/useOnboardingStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function OnboardingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { isOnboardingCompleted } = useOnboardingStore();
  const router = useRouter();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && isOnboardingCompleted) {
      router.replace('/');
    }
  }, [isOnboardingCompleted, isMounted, router]);
  
  if (!isMounted) {
    // Loading state (prevents hydration mismatch)
    return <div className="min-h-screen bg-white" />; 
  }
  
  return <OnboardingPageMobile />;
}
