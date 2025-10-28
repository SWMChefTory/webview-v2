import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import WriteLongTextModal from "./writeLongTextModal";
import { request, MODE } from "@/src/shared/client/native/client";
import {useQueryClient} from "@tanstack/react-query";
import {setMainAccessToken} from "@/src/shared/client/main/client";
import { useUser } from "@/src/shared/model/user";

const withdrawalReasons = {
  "1": "앱 사용법이 복잡해서",
  "2": "필요한 기능이 부족해서",
  "3": "다른 서비스를 이용하기 위해서",
  "4": "요리를 하지 않게 되어서",
  "5": "시간이 없어서 사용하지 않아서",
  "6": "다른 요리 앱을 사용하게 되어서",
  "7": "기타",
};

const DELETE_USER = "DELETE_USER";

export default function MemberShipWithdrawalPage() {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: string }>({});
  const { user } = useUser();
  const [feedbacks, setFeedbacks] = useState<{ [key: string]: string }>({});

  const queryClient = useQueryClient();

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

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <div className="w-full max-w-2xl bg-white min-h-screen">
        <div className="w-[85%] mx-auto py-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user?.nickname}님,</h1>
            <h1 className="text-3xl font-bold text-gray-900">정말 탈퇴하시나요?</h1>
            
            <div className="h-8" />
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                ⓘ 회원탈퇴 시 다음 정보가 삭제되어요.
              </h2>
              <div className="pl-2 space-y-2">
                <p className="text-base text-gray-700">- 저장된 모든 레시피 및 즐겨찾기</p>
                <p className="text-base text-gray-700">- 생성한 카테고리 및 요리 기록</p>
                <p className="text-base text-gray-700">- 회원 개인 정보</p>
              </div>
            </div>
            
            <div className="h-12" />
            
            <h1 className="text-2xl font-bold text-gray-900">떠나시는 이유를 알려주세요.</h1>
            <div className="h-4" />
            <h2 className="text-lg text-gray-500">
              돌아오실 때 더 좋은 서비스를 제공할게요.
            </h2>
            <div className="h-6" />

            <RadioButtonItemGroup
              items={withdrawalReasons}
              addItems={addItems}
              deleteItems={deleteItems}
              selectedItems={selectedItems}
              feedbacks={feedbacks} // 👈 추가
              saveFeedback={saveFeedback} // 👈 추가
            />
          </div>
          
          <div className="h-16" />

          <button
            onClick={() => {
              const withdrawalData = Object.keys(selectedItems).map(key => ({
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
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            탈퇴하기
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
  feedbacks, // 👈 추가
  saveFeedback, // 👈 추가
}: {
  items: { [key: string]: string };
  addItems: (
    key: string,
    selectedItems: { [key: string]: string },
    items: { [key: string]: string }
  ) => void;
  deleteItems: (key: string, selectedItems: { [key: string]: string }) => void;
  selectedItems: { [key: string]: string };
  feedbacks: { [key: string]: string }; // 👈 추가
  saveFeedback: (key: string, feedback: string) => void; // 👈 추가
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
          feedback={feedbacks[key]} // 👈 추가
          saveFeedback={(feedback) => saveFeedback(key, feedback)} // 👈 추가
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
  feedback, // 👈 추가
  saveFeedback, // 👈 추가
}: {
  itemKey: string;
  item: string;
  addItems: () => void;
  deleteItems: () => void;
  isChecked: boolean;
  feedback?: string; // 👈 추가
  saveFeedback: (feedback: string) => void; // 👈 추가
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
          feedback={feedback} // 👈 추가
          saveFeedback={saveFeedback} // 👈 추가
        />
      </div>
      
      {/* 👇 작성한 피드백 미리보기 */}
      {isChecked && feedback && (
        <div className="px-3 pb-3">
          <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">작성한 의견</p>
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
  feedback, // 👈 추가
  saveFeedback, // 👈 추가
}: {
  label: string;
  isDisabled: boolean;
  feedback?: string; // 👈 추가
  saveFeedback: (feedback: string) => void; // 👈 추가
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
        {/* 👇 피드백 작성 여부 표시 */}
        {!isDisabled && feedback && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
        )}
      </button>
      <WriteLongTextModal
        label={label}
        isVisible={isVisible}
        setModalVisible={setModalVisible}
        initialFeedback={feedback || ""} // 👈 추가
        onSave={saveFeedback} // 👈 추가
      />
    </>
  );
}