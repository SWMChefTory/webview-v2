import { cn } from "@/lib/utils";

interface TutorialArrowProps {
  onClick: () => void;
  isAnimating: boolean;
}

export function TutorialArrow({ onClick, isAnimating }: TutorialArrowProps) {
  const animationClass = isAnimating ? 'animate-ping' : 'animate-bounce';
  
  return (
    <div className="absolute top-1/4 right-10 animate-bounce">
      <div className={cn(
        "relative w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl cursor-pointer shadow-lg hover:bg-orange-600 transition",
        animationClass
      )} onClick={onClick}>
        🔗
        {/* Pulse animation */}
        {isAnimating && (
          <span className="absolute inset-0 rounded-full border-4 border-orange-300 animate-ping" />
        )}
      </div>
    </div>
  );
}
