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
        className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2"
        style={{ backgroundColor: "#FEE500" }}
      >
        <RiKakaoTalkFill size={24} className="text-black" />
        <span className="text-black font-medium">카카오톡에서 인증하기</span>
      </button>
    </div>
  );
}
