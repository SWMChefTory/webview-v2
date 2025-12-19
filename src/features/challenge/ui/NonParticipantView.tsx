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
    <div className="flex flex-col items-center justify-center px-4 py-16">
      {/* 일러스트 */}
      <div className="w-40 h-40 mb-8">
        <img
          src="/empty_state.png"
          alt="비참여자"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 안내 문구 */}
      <div className="text-center space-y-2 mb-8">
        <h3 className="text-xl font-bold text-gray-900">
          현재 챌린지 참여 대상이 아닙니다
        </h3>
        <p className="text-gray-600">
          다음 챌린지에 참여하고 싶으시다면
          <br />
          아래 버튼을 눌러 신청해주세요!
        </p>
      </div>

      {/* 신청 버튼 */}
      <button
        onClick={handleSignupClick}
        className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg"
      >
        다음 챌린지 참여 신청하기
      </button>
    </div>
  );
}
