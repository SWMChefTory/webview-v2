import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useLangcode, Lang } from "@/src/shared/translation/useLangCode";

// 다국어 메시지 포매터
const formatFeedbackModalMessages = (lang: Lang) => {
  switch (lang) {
    case "en":
      return {
        title: "Write Detailed Feedback",
        reasonLabel: "Selected Reason",
        label: "Please provide detailed feedback",
        placeholder: "Your feedback helps us improve our service...",
        optional: "Optional",
        count: (current: number, max: number) => `${current} / ${max}`,
        tip: {
          title: "💡 Writing Tips",
          items: [
            "• Specific feedback is more helpful",
            "• Let us know what was uncomfortable or needs improvement",
            "• Your feedback will be anonymous",
          ],
        },
        cancel: "Cancel",
        save: "Save",
      };
    default:
      return {
        title: "자세한 의견 작성",
        reasonLabel: "선택한 이유",
        label: "자세한 의견을 들려주세요",
        placeholder: "더 나은 서비스를 위해 구체적인 의견을 남겨주세요...",
        optional: "선택사항입니다",
        count: (current: number, max: number) => `${current} / ${max}`,
        tip: {
          title: "💡 의견 작성 TIP",
          items: [
            "• 구체적인 의견일수록 서비스 개선에 큰 도움이 됩니다",
            "• 불편했던 점이나 개선이 필요한 부분을 알려주세요",
            "• 작성하신 내용은 익명으로 처리됩니다",
          ],
        },
        cancel: "취소",
        save: "저장",
      };
  }
};

export default function WriteCustomerFeedbackModalContent({
  onClose,
  onSave,
  label,
  initialFeedback,
}: {
  onClose: () => void;
  onSave: (feedback: string) => void;
  label: string;
  initialFeedback?: string;
}) {
  const [feedback, setFeedback] = useState(initialFeedback || "");
  const maxLength = 500;
  const lang = useLangcode();
  const messages = formatFeedbackModalMessages(lang);

  useEffect(() => {
    setFeedback(initialFeedback || "");
  }, [initialFeedback]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-xl font-bold">{messages.title}</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <IoMdClose size={24} />
        </button>
      </div>

      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">{messages.reasonLabel}</p>
          <div className="bg-orange-50 px-4 py-3 rounded-lg">
            <p className="font-semibold text-orange-700">{label}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {messages.label}
          </label>
          <textarea
            value={feedback}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                setFeedback(e.target.value);
              }
            }}
            placeholder={messages.placeholder}
            className="w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-400">{messages.optional}</p>
            <p className="text-sm text-gray-500">
              {messages.count(feedback.length, maxLength)}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <p className="text-sm text-blue-800">{messages.tip.title}</p>
          <ul className="text-sm text-blue-700 space-y-1 pl-4">
            {messages.tip.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-6 py-4 border-t bg-white">
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            {messages.cancel}
          </button>
          <button
            onClick={() => onSave(feedback)}
            className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            {messages.save}
          </button>
        </div>
      </div>
    </div>
  );
}