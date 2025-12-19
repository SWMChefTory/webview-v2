import { CHALLENGE_SIGNUP_FORM_URL } from "../model/types";
import { MODE, request } from "@/src/shared/client/native/client";

export function NonParticipantView() {
  const handleSignupClick = () => {
    if (typeof window !== "undefined" && window.ReactNativeWebView) {
      request(MODE.UNBLOCKING, "OPEN_EXTERNAL_URL", {
        url: CHALLENGE_SIGNUP_FORM_URL,
      });
    } else {
      window.open(CHALLENGE_SIGNUP_FORM_URL, "_blank");
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 min-h-[400px]">
      {/* 일러스트 */}
      <div className="w-36 h-36 mb-6">
        <img
          src="/empty_state.png"
          alt="비참여자"
          className="w-full h-full object-contain opacity-90"
        />
      </div>

      {/* 안내 문구 */}
      <div className="text-center space-y-3 mb-8">
        <h3 className="text-xl font-bold text-gray-900">
          아직 챌린지에 참여하지 않으셨네요
        </h3>
        <p className="text-gray-500 leading-relaxed">
          다음 챌린지에 함께해요!
          <br />
          <span className="text-gray-600 font-medium">신청은 간단합니다 ✨</span>
        </p>
      </div>

      {/* 신청 버튼 */}
      <button
        onClick={handleSignupClick}
        className="px-8 py-3.5 bg-orange-500 text-white font-semibold rounded-xl
          shadow-lg shadow-orange-200 transition-all duration-200
          active:scale-[0.98] active:shadow-md"
      >
        다음 챌린지 참여 신청하기
      </button>
    </div>
  );
}
