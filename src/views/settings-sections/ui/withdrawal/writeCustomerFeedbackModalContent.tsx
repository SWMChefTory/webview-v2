import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useWithdrawalTranslation } from "../../hooks/useWithdrawalTranslation";

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
  const { t } = useWithdrawalTranslation();

  useEffect(() => {
    setFeedback(initialFeedback || "");
  }, [initialFeedback]);

  const tipItems = t("modal.tip.items", { returnObjects: true }) as string[];

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-xl font-bold">{t("modal.title")}</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <IoMdClose size={24} />
        </button>
      </div>

      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">{t("modal.reasonLabel")}</p>
          <div className="bg-orange-50 px-4 py-3 rounded-lg">
            <p className="font-semibold text-orange-700">{label}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {t("modal.label")}
          </label>
          <textarea
            value={feedback}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                setFeedback(e.target.value);
              }
            }}
            placeholder={t("modal.placeholder")}
            className="w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-400">{t("modal.optional")}</p>
            <p className="text-sm text-gray-500">
              {t("modal.count", { current: feedback.length, max: maxLength })}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <p className="text-sm text-blue-800">{t("modal.tip.title")}</p>
          <ul className="text-sm text-blue-700 space-y-1 pl-4">
            {tipItems.map((item, index) => (
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
            {t("modal.cancel")}
          </button>
          <button
            onClick={() => onSave(feedback)}
            className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            {t("modal.save")}
          </button>
        </div>
      </div>
    </div>
  );
}