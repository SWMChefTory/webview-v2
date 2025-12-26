import { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import WriteLongTextModal from "./writeLongTextModal";
import { request, MODE } from "@/src/shared/client/native/client";
import { useQueryClient } from "@tanstack/react-query";
import { setMainAccessToken } from "@/src/shared/client/main/client";
import { useUser } from "@/src/shared/model/user";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useWithdrawalTranslation } from "../../hooks/useWithdrawalTranslation";

const DELETE_USER = "DELETE_USER";

// 탈퇴 사유 키 → Amplitude 값 매핑
const WITHDRAWAL_REASON_MAP: { [key: string]: string } = {
  "1": "complex_to_use",
  "2": "lack_features",
  "3": "use_other_service",
  "4": "no_more_cooking",
  "5": "no_time",
  "6": "use_other_app",
  "7": "other",
};

export default function MemberShipWithdrawalPage() {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: string }>(
    {}
  );
  const { user } = useUser();
  const [feedbacks, setFeedbacks] = useState<{ [key: string]: string }>({});
  const { t } = useWithdrawalTranslation();
  const queryClient = useQueryClient();

  // 페이지 진입 추적
  useEffect(() => {
    track(AMPLITUDE_EVENT.WITHDRAWAL_START);
  }, []);

  const addItems = (
    key: string,
    selectedItems: { [key: string]: string },
    items: { [key: string]: string }
  ) => {
    setSelectedItems({ ...selectedItems, [key]: items[key] });
  };

  const deleteItems = (
    key: string,
    selectedItems: { [key: string]: string }
  ) => {
    const newSelectedItems = { ...selectedItems };
    delete newSelectedItems[key];
    setSelectedItems(newSelectedItems);

    const newFeedbacks = { ...feedbacks };
    delete newFeedbacks[key];
    setFeedbacks(newFeedbacks);
  };

  const saveFeedback = (key: string, feedback: string) => {
    setFeedbacks({ ...feedbacks, [key]: feedback });
  };

  const titleMain = t("main.title.main", { nickname: user?.nickname || "" });
  const titleSub = t("main.title.sub");
  const infoBoxTitle = t("main.infoBox.title");
  const infoBoxItems = t("main.infoBox.items", { returnObjects: true }) as string[];
  const reasonsTitle = t("main.reasons.title");
  const reasonsSub = t("main.reasons.sub");
  const reasonsItems = t("main.reasons.items", { returnObjects: true }) as { [key: string]: string };
  const feedbackPreview = t("main.feedbackPreview");
  const buttonText = t("main.button");

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <div className="w-full max-w-2xl bg-white min-h-screen">
        <div className="w-[85%] mx-auto py-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {titleMain}
            </h1>
            {titleSub && (
              <h1 className="text-3xl font-bold text-gray-900">
                {titleSub}
              </h1>
            )}

            <div className="h-8" />

            <div className="bg-orange-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {infoBoxTitle}
              </h2>
              <div className="pl-2 space-y-2">
                {infoBoxItems.map((item, index) => (
                  <p key={index} className="text-base text-gray-700">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="h-12" />

            <h1 className="text-2xl font-bold text-gray-900">
              {reasonsTitle}
            </h1>
            <div className="h-4" />
            <h2 className="text-lg text-gray-500">{reasonsSub}</h2>
            <div className="h-6" />

            <RadioButtonItemGroup
              items={reasonsItems}
              addItems={addItems}
              deleteItems={deleteItems}
              selectedItems={selectedItems}
              feedbacks={feedbacks}
              saveFeedback={saveFeedback}
              feedbackLabel={feedbackPreview}
            />
          </div>

          <div className="h-16" />

          <button
            onClick={() => {
              const selectedKeys = Object.keys(selectedItems);

              // Amplitude 이벤트 전송
              track(AMPLITUDE_EVENT.ACCOUNT_DELETE, {
                reasons: selectedKeys.map((key) => WITHDRAWAL_REASON_MAP[key]),
                feedback_count: Object.values(feedbacks).filter(
                  (f) => f.trim().length > 0
                ).length,
              });

              // 기존 탈퇴 로직
              const withdrawalData = selectedKeys.map((key) => ({
                reason: selectedItems[key],
                feedback: feedbacks[key] || "",
              }));
              queryClient.clear();
              setMainAccessToken("");
              request(MODE.UNBLOCKING, DELETE_USER, withdrawalData);
            }}
            disabled={Object.keys(selectedItems).length === 0}
            className={`w-full py-4 rounded-lg font-bold text-lg transition ${
              Object.keys(selectedItems).length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {buttonText}
          </button>

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}

function RadioButtonItemGroup({
  items,
  addItems,
  deleteItems,
  selectedItems,
  feedbacks,
  saveFeedback,
  feedbackLabel,
}: {
  items: { [key: string]: string };
  addItems: (
    key: string,
    selectedItems: { [key: string]: string },
    items: { [key: string]: string }
  ) => void;
  deleteItems: (key: string, selectedItems: { [key: string]: string }) => void;
  selectedItems: { [key: string]: string };
  feedbacks: { [key: string]: string };
  saveFeedback: (key: string, feedback: string) => void;
  feedbackLabel: string;
}) {
  return (
    <div className="space-y-1">
      {Object.keys(items).map((key: string) => (
        <RadioButtonItem
          key={key}
          itemKey={key}
          item={items[key]}
          addItems={() => addItems(key, selectedItems, items)}
          deleteItems={() => deleteItems(key, selectedItems)}
          isChecked={selectedItems[key] ? true : false}
          feedback={feedbacks[key]}
          saveFeedback={(feedback) => saveFeedback(key, feedback)}
          feedbackLabel={feedbackLabel}
        />
      ))}
    </div>
  );
}

function RadioButtonItem({
  itemKey,
  item,
  addItems,
  deleteItems,
  isChecked,
  feedback,
  saveFeedback,
  feedbackLabel,
}: {
  itemKey: string;
  item: string;
  addItems: () => void;
  deleteItems: () => void;
  isChecked: boolean;
  feedback?: string;
  saveFeedback: (feedback: string) => void;
  feedbackLabel: string;
}) {
  return (
    <div className="flex flex-col border border-gray-200 rounded-lg hover:bg-gray-50 transition">
      <div className="flex flex-row items-center justify-between p-3">
        <button
          onClick={() => (isChecked ? deleteItems() : addItems())}
          className="flex-1 flex flex-row items-center"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={isChecked}
                readOnly
                className="w-5 h-5 rounded-full appearance-none border-2 border-gray-300 checked:border-orange-500 checked:bg-orange-500 cursor-pointer transition"
              />
              {isChecked && (
                <svg
                  className="absolute w-3 h-3 text-white pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-base transition ${
                isChecked ? "text-orange-500 font-semibold" : "text-gray-600"
              }`}
            >
              {item}
            </span>
          </div>
        </button>
        <WriteButton
          label={item}
          isDisabled={!isChecked}
          feedback={feedback}
          saveFeedback={saveFeedback}
        />
      </div>

      {isChecked && feedback && (
        <div className="px-3 pb-3">
          <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">{feedbackLabel}</p>
            <p className="text-sm text-gray-700 line-clamp-2">{feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function WriteButton({
  isDisabled,
  label,
  feedback,
  saveFeedback,
}: {
  label: string;
  isDisabled: boolean;
  feedback?: string;
  saveFeedback: (feedback: string) => void;
}) {
  const [isVisible, setModalVisible] = useState(false);

  return (
    <>
      <button
        disabled={isDisabled}
        onClick={() => setModalVisible(true)}
        className={`p-2 rounded-full transition relative ${
          isDisabled
            ? "text-gray-300 cursor-not-allowed"
            : "text-orange-500 hover:bg-orange-50"
        }`}
      >
        <FiEdit2 size={20} />
        
        {!isDisabled && feedback && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
        )}
      </button>
      <WriteLongTextModal
        label={label}
        isVisible={isVisible}
        setModalVisible={setModalVisible}
        initialFeedback={feedback || ""}
        onSave={saveFeedback}
      />
    </>
  );
}