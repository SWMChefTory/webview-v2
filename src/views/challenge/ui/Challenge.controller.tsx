import { useRouter } from "next/router";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";
import Header, { BackButton } from "@/src/shared/ui/header/header";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { SSRErrorBoundary } from "@/src/shared/boundary/SSRErrorBoundary";
import {
  ChallengeErrorFallback,
  useChallengeInfo,
  CHALLENGE_TYPE_LABELS,
} from "@/src/features/challenge";

export type ChallengeVariant = "mobile" | "tablet" | "desktop";

export interface ChallengePageProps {
  onBack: () => void;
  headerContent: React.ReactNode;
  renderErrorBoundary: (children: React.ReactNode) => React.ReactNode;
}

export function useChallengeController(
  variant: ChallengeVariant
): ChallengePageProps {
  const router = useRouter();

  const safeAreaColor = variant === "mobile" ? "#FFFFFF" : "#F9FAFB";

  useSafeArea({
    top: { color: safeAreaColor, isExists: true },
    bottom: { color: safeAreaColor, isExists: true },
    left: { color: safeAreaColor, isExists: true },
    right: { color: safeAreaColor, isExists: true },
  });

  const titleSize = {
    mobile: "text-xl font-semibold",
    tablet: "text-2xl font-semibold",
    desktop: "text-3xl font-bold",
  }[variant];

  return {
    onBack: () => router.back(),
    headerContent: (
      <div className="flex flex-row gap-3 items-center">
        <BackButton onClick={() => router.back()} />
        <SSRSuspense
          fallback={<h1 className={titleSize}>집밥 챌린지</h1>}
        >
          <ChallengeTitle titleSize={titleSize} />
        </SSRSuspense>
      </div>
    ),
    renderErrorBoundary: (children: React.ReactNode) => (
      <SSRErrorBoundary
        fallbackRender={({ resetErrorBoundary }) => (
          <ChallengeErrorFallback resetErrorBoundary={resetErrorBoundary} />
        )}
      >
        {children}
      </SSRErrorBoundary>
    ),
  };
}

function ChallengeTitle({ titleSize }: { titleSize: string }) {
  const { data } = useChallengeInfo();

  if (!data.isParticipant) {
    return <h1 className={titleSize}>집밥 챌린지</h1>;
  }

  const title = `${CHALLENGE_TYPE_LABELS[data.challengeType]} 집밥 챌린지`;
  return <h1 className={titleSize}>{title}</h1>;
}
