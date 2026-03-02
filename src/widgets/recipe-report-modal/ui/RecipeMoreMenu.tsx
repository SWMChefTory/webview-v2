import { createPortal } from "react-dom";
import { Flag, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { isNativeApp } from "@/src/shared/lib/platform";
import { MODE, request } from "@/src/shared/client/native/client";
import { useRecipeReportModalStore } from "../hooks/useRecipeReportModalStore";
import { useRecipeReportTranslation } from "../hooks/useRecipeReportTranslation";

const KAKAO_OPEN_CHAT_URL = "https://open.kakao.com/o/sXzywB7h";

interface RecipeMoreMenuProps {
  recipeId: string;
  isOpen: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export function RecipeMoreMenu({
  recipeId,
  isOpen,
  onClose,
  anchorEl,
}: RecipeMoreMenuProps) {
  const { t } = useRecipeReportTranslation();
  const { open: openReportModal } = useRecipeReportModalStore();

  if (!isOpen || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();
  const menuStyle: React.CSSProperties = {
    position: "fixed",
    top: rect.bottom + 8,
    right: window.innerWidth - rect.right,
    zIndex: 1000,
  };

  const handleReportClick = () => {
    openReportModal(recipeId);
    onClose();
  };

  const handleContactClick = () => {
    if (isNativeApp()) {
      request(MODE.UNBLOCKING, "OPEN_EXTERNAL_URL", { url: KAKAO_OPEN_CHAT_URL });
    } else {
      window.open(KAKAO_OPEN_CHAT_URL, "_blank");
    }
    onClose();
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[999]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <div
        style={menuStyle}
        className={cn(
          "bg-white rounded-xl shadow-lg border border-gray-100",
          "min-w-[160px] py-2",
          "animate-in fade-in-0 zoom-in-95 duration-150"
        )}
      >
        <button
          type="button"
          onClick={handleReportClick}
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 text-left",
            "text-gray-700 hover:bg-gray-50 active:bg-gray-100",
            "transition-colors"
          )}
        >
          <Flag className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">{t("menu.report")}</span>
        </button>
        <button
          type="button"
          onClick={handleContactClick}
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 text-left",
            "text-gray-700 hover:bg-gray-50 active:bg-gray-100",
            "transition-colors"
          )}
        >
          <MessageCircle className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">{t("menu.contact")}</span>
        </button>
      </div>
    </>,
    document.body
  );
}
