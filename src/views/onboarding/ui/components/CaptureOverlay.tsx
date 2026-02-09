import { cn } from "@/lib/utils";

interface CaptureOverlayProps {
  icon: string;
  message: string;
  onClose: () => void;
}

export function CaptureOverlay({ icon, message, onClose }: CaptureOverlayProps) {
  return (
    <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center p-8 animate-fadeIn">
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-white text-xl font-semibold text-center">
        {message}
      </p>
      <button
        onClick={onClose}
        className="mt-6 px-6 py-2 bg-white text-gray-800 rounded-full font-semibold"
      >
        닫기
      </button>
    </div>
  );
}
