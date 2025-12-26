import * as Dialog from "@radix-ui/react-dialog";

import { useState, useEffect, useRef } from "react";
import { useCreateRecipe } from "@/src/entities/user-recipe/model/useUserRecipe";

import { useRecipeCreatingViewOpenStore } from "./recipeCreatingViewOpenStore";
import { FormInput, FormButton } from "@/src/shared/form/components";
import { ShareTutorialModal } from "./shareTutorialModal";
import { useFetchCategories } from "@/src/entities/category/model/useCategory";
import { HorizontalScrollArea } from "@/src/views/home/ui/horizontalScrollArea";
import { motion } from "motion/react";

import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

import { useTranslation } from "next-i18next";

export function RecipeCreatingView() {
  const [hasEverTyped, setHasEverTyped] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const { create } = useCreateRecipe();
  const {
    isOpen,
    videoUrl: url,
    entryPoint,
    setIsOpen,
    setUrl,
    close,
  } = useRecipeCreatingViewOpenStore();

  const { t } = useTranslation("common");
  const hasTrackedStartRef = useRef(false);

  // recipe_create_start_url 이벤트 (모달이 열릴 때 한 번만 발생)
  useEffect(() => {
    if (isOpen && entryPoint && !hasTrackedStartRef.current) {
      track(AMPLITUDE_EVENT.RECIPE_CREATE_START_URL, {
        entry_point: entryPoint,
        has_prefilled_url: url.trim().length > 0,
      });
      hasTrackedStartRef.current = true;
    }

    // 모달이 닫히면 추적 플래그 리셋
    if (!isOpen) {
      hasTrackedStartRef.current = false;
    }
  }, [isOpen, entryPoint, url]);

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
      // recipe_create_submit_url 이벤트
      track(AMPLITUDE_EVENT.RECIPE_CREATE_SUBMIT_URL, {
        entry_point: entryPoint || "floating_button",
        has_target_category: !!selectedCategoryId,
        target_category_id: selectedCategoryId || undefined,
      });

      create({
        youtubeUrl: url,
        targetCategoryId: selectedCategoryId,
        _entryPoint: entryPoint || "floating_button",
        _creationMethod: "url",
        _hasTargetCategory: !!selectedCategoryId,
      });
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
                {t("recipeCreating.form.title")}
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
                errorMessage={t("recipeCreating.form.invalidUrl")}
                placeholder={t("recipeCreating.form.placeholder")}
              />
            </div>
            <div className="p-3">
              <FormButton
                onSubmit={handleSubmit}
                label={t("recipeCreating.form.submit")}
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