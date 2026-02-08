import { OnboardingPageMobile } from "./ui";
import { useOnboardingStore } from "./stores/useOnboardingStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function OnboardingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { isOnboardingCompleted, redirectPath } = useOnboardingStore();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && isOnboardingCompleted) {
      router.replace(redirectPath ?? '/');
    }
  }, [isOnboardingCompleted, isMounted, router, redirectPath]);
  
  if (!isMounted) {
    // Loading state (prevents hydration mismatch)
    return <div className="min-h-screen bg-white" />; 
  }
  
  return <OnboardingPageMobile />;
}
