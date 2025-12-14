import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useCreateRecipe } from "@/src/entities/user-recipe/model/useUserRecipe";
import { useRecipeCreatingViewOpenStore } from "./recipeCreatingViewOpenStore";
import { FormInput, FormButton } from "@/src/shared/form/components";
import { ShareTutorialModal } from "./shareTutorialModal";
import { useFetchCategories } from "@/src/entities/category/model/useCategory";
import { HorizontalScrollArea } from "@/src/views/home/ui/horizontalScrollArea";
import { motion } from "motion/react";
import { useLangcode, Lang } from "@/src/shared/translation/useLangCode";

// 다국어 메시지 포매터 정의
const formatRecipeCreatingMessages = (lang: Lang) => {
  switch (lang) {
    case "en":
      return {
        title: "Create Recipe",
        invalidUrl: "This input is not a valid YouTube link",
        placeholder: "Please enter a YouTube link",
        submit: "Done",
      };
    default:
      return {
        title: "레시피 생성하기",
        invalidUrl: "해당 입력은 유튜브 링크가 아니에요",
        placeholder: "유튜브 링크를 입력해주세요",
        submit: "완료",
      };
  }
};

export function RecipeCreatingView() {
  const [hasEverTyped, setHasEverTyped] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const { create } = useCreateRecipe();
  const {
    isOpen,
    videoUrl: url,
    setIsOpen,
    setUrl,
    close,
  } = useRecipeCreatingViewOpenStore();

  // 1. 언어 설정 가져오기
  const lang = useLangcode();
  const messages = formatRecipeCreatingMessages(lang);

  const isValidYoutubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const isError = () => {
    const error = hasEverTyped && url.length > 0 && !isValidYoutubeUrl(url);
    return error;
  };

  const handleUrlChange = (url: string) => {
    setUrl(url);
    setHasEverTyped(true);
  };

  const isSubmittable = () => {
    return url.length > 0 && isValidYoutubeUrl(url);
  };

  const handleSubmit = async () => {
    if (isSubmittable()) {
      create({ youtubeUrl: url, targetCategoryId: selectedCategoryId });
      setHasEverTyped(false);
      close();
    }
  };
  return (
    <>
      <ShareTutorialModal />
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[1500] " />
          <Dialog.Content
            data-tour="create-recipe"
            className="fixed left-0 right-0 bottom-0 z-[2000] bg-white w-full rounded-t-lg"
          >
            <div className="p-5">
              <Dialog.Title className="text-xl font-bold">
                {messages.title}
              </Dialog.Title>
            </div>
            <CategoryChipListSection
              selectedCategoryId={selectedCategoryId}
              onSelect={({ selectedCategoryId }) => {
                setSelectedCategoryId(selectedCategoryId);
              }}
            />
            <div className="px-4 pb-5">
              <FormInput
                value={url}
                onChange={handleUrlChange}
                isError={isError()}
                errorMessage={messages.invalidUrl}
                placeholder={messages.placeholder}
              />
            </div>
            <div className="p-3">
              <FormButton
                onSubmit={handleSubmit}
                label={messages.submit}
                isSubmittable={isSubmittable()}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function CategoryChipListSection({
  onSelect,
  selectedCategoryId,
}: {
  onSelect: ({
    selectedCategoryId,
  }: {
    selectedCategoryId: string | null;
  }) => void;
  selectedCategoryId: string | null;
}) {
  const { data: categories } = useFetchCategories();

  function handleClick({ selectedId }: { selectedId: string }) {
    if (selectedCategoryId === selectedId) {
      onSelect({ selectedCategoryId: null });
      return;
    }
    onSelect({ selectedCategoryId: selectedId });
  }

  return (
    <>
      {categories && (
        <>
          <HorizontalScrollArea>
            {categories.map((category) => {
              return (
                <CategoryChip
                  key={category.id}
                  name={category.name}
                  isSelected={category.id === selectedCategoryId}
                  onClick={() => {
                    handleClick({ selectedId: category.id });
                  }}
                />
              );
            })}
          </HorizontalScrollArea>
          <div className="h-4" />
        </>
      )}
    </>
  );
}

function CategoryChip({
  name,
  isSelected,
  onClick,
}: {
  name: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      className={`rounded-xl px-2 py-1 whitespace-nowrap font-semibold border ${
        isSelected
          ? "border-black bg-black text-white"
          : "border-gray-300 text-gray-500"
      }`}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {name}
    </motion.div>
  );
}