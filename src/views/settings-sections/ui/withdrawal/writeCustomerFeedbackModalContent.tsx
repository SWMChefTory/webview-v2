import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

export default function WriteCustomerFeedbackModalContent({
  onClose,
  onSave,
  label,
  initialFeedback, // 👈 추가
}: {
  onClose: () => void;
  onSave: (feedback: string) => void; // 👈 수정
  label: string;
  initialFeedback?: string; // 👈 추가
}) {
  const [feedback, setFeedback] = useState(initialFeedback || ""); // 👈 수정
  const maxLength = 500;

  // 👇 initialFeedback 변경 시 업데이트
  useEffect(() => {
    setFeedback(initialFeedback || "");
  }, [initialFeedback]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-xl font-bold">자세한 의견 작성</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <IoMdClose size={24} />
        </button>
      </div>

      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">선택한 이유</p>
          <div className="bg-orange-50 px-4 py-3 rounded-lg">
            <p className="font-semibold text-orange-700">{label}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            자세한 의견을 들려주세요
          </label>
          <textarea
            value={feedback}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                setFeedback(e.target.value);
              }
            }}
            placeholder="더 나은 서비스를 위해 구체적인 의견을 남겨주세요..."
            className="w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-400">선택사항입니다</p>
            <p className="text-sm text-gray-500">
              {feedback.length} / {maxLength}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <p className="text-sm text-blue-800">💡 의견 작성 TIP</p>
          <ul className="text-sm text-blue-700 space-y-1 pl-4">
            <li>• 구체적인 의견일수록 서비스 개선에 큰 도움이 됩니다</li>
            <li>• 불편했던 점이나 개선이 필요한 부분을 알려주세요</li>
            <li>• 작성하신 내용은 익명으로 처리됩니다</li>
          </ul>
        </div>
      </div>

      <div className="px-6 py-4 border-t bg-white">
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            취소
          </button>
          <button
            onClick={() => onSave(feedback)} // 👈 수정
            className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}