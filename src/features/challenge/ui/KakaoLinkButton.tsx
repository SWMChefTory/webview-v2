import { RiKakaoTalkFill } from "react-icons/ri";
import { FiExternalLink } from "react-icons/fi";
import { MODE, request } from "@/src/shared/client/native/client";

interface KakaoLinkButtonProps {
  url: string;
}

export function KakaoLinkButton({ url }: KakaoLinkButtonProps) {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.ReactNativeWebView) {
      request(MODE.UNBLOCKING, "OPEN_EXTERNAL_URL", { url });
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="px-4 py-4">
      <button
        onClick={handleClick}
        className="w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5
          shadow-lg transition-all duration-200
          active:scale-[0.98] active:shadow-md
          border border-yellow-400/50"
        style={{
          backgroundColor: "#FEE500",
          boxShadow: "0 4px 14px -3px rgba(254, 229, 0, 0.5)",
        }}
      >
        <RiKakaoTalkFill size={22} className="text-black/85" />
        <span className="text-black/85 font-semibold">카카오톡에서 인증하기</span>
        <FiExternalLink size={14} className="text-black/60" />
      </button>
    </div>
  );
}
