import { RiKakaoTalkFill } from "react-icons/ri";
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
        className="w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2
          shadow-md transition-all duration-200
          active:scale-[0.98] active:shadow-sm"
        style={{ backgroundColor: "#FEE500" }}
      >
        <RiKakaoTalkFill size={20} className="text-black/90" />
        <span className="text-black/90 font-semibold">카카오톡에서 인증하기</span>
      </button>
    </div>
  );
}
