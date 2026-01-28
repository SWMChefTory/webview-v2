import { useState, useEffect, useRef } from "react";
import { Sheet } from "react-modal-sheet";
import {
  useCreateRecipe,
  extractYouTubeVideoId,
} from "@/src/entities/user-recipe/model/useUserRecipe";
import { Loader2 } from "lucide-react";

import { useRecipeCreatingViewOpenStore } from "./recipeCreatingFormOpenStore";
import { FormInput } from "@/src/shared/form/components";
import { ShareTutorialModal } from "./shareTutorialModal";
import { useFetchCategories } from "@/src/entities/category/model/useCategory";
import { HorizontalScrollArea } from "@/src/views/home/ui/horizontalScrollArea";
import { motion } from "motion/react";

import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

import { useTranslation } from "next-i18next";

import Image from "next/image";
import { useFetchBalance } from "@/src/entities/balance/model/useFetchBalance";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import RecipeErollModal from "../recipe-creating-modal/recipeErollModal";

export function RecipeCreatingView() {
  const [hasEverTyped, setHasEverTyped] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const { create, isLoading: isCreating } = useCreateRecipe();
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
      // Video ID 추출
      const videoId = extractYouTubeVideoId(url);

      // recipe_create_submit_url 이벤트
      track(AMPLITUDE_EVENT.RECIPE_CREATE_SUBMIT_URL, {
        entry_point: entryPoint || "floating_button",
        has_target_category: !!selectedCategoryId,
        target_category_id: selectedCategoryId || undefined,
        video_url: url.trim(),
        video_id: videoId || undefined,
      });

      create({
        youtubeUrl: url,
        targetCategoryId: selectedCategoryId,
        _entryPoint: entryPoint || "floating_button",
        _creationMethod: "url",
        _hasTargetCategory: !!selectedCategoryId,
        _videoUrl: url.trim(),
        _videoId: videoId || undefined,
      });
      // open(recipeId);
      setHasEverTyped(false);
      close();
    }
  };

  return (
    <>
      <ShareTutorialModal />
      <Sheet
        isOpen={isOpen||isCreating}
        onClose={() => {
          setIsOpen(false);
        }}
        detent="content"
        avoidKeyboard={false}
      >
        <Sheet.Container  
          style={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            overflow: "hidden",
          }}
        >
          {/* <Sheet.Header /> */}
          <Sheet.Content>
            <div className="bg-white">
              <div className="p-5">
                <Title />
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
              <div className="w-full flex justify-center items-center">
              <div className="px-4 text-sm text-gray-500">{t("recipeCreating.berry.usesOne")}</div>
              </div>
              <div className="p-3">
                <CreateFormButton
                  isLoading={isCreating}
                  onSubmit={handleSubmit}
                  isValidUrl={isSubmittable()}
                />
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          onTap={() => {
            setIsOpen(false);
          }}
        />
      </Sheet>
      <RecipeErollModal />
    </>
  );
}

const TitleSkeleton = () => {
  const { t } = useTranslation("common");
  return (
    <div className="text-xl font-bold flex justify-between items-center">
      <p>{t("recipeCreating.form.title")}</p>
      <p className="px-2 py-1 text-base text-red-500 font-base flex justify-center items-center gap-0.5">
        <Image
          src="/images/berry/berry.png"
          alt="berry"
          width={22}
          height={22}
          className="object-contain"
        />
        0
      </p>
    </div>
  );
};

const TitleReady = () => {
  const { data: balance } = useFetchBalance();
  const { t } = useTranslation("common");
  return (
    <div className="text-xl font-bold flex justify-between items-center">
      {t("recipeCreating.modal.titleReady")}
      <p className="px-2 py-1 text-base text-red-500 font-base flex justify-center items-center gap-0.5">
        <Image
          src="/images/berry/berry.png"
          alt="berry"
          width={22}
          height={22}
          className="object-contain"
        />
        {balance.balance}
      </p>
    </div>
  );
};

const Title = () => {
  return (
    <SSRSuspense fallback={<TitleSkeleton />}>
      <TitleReady />
    </SSRSuspense>
  );
};

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

const LoadingFormButton = () => {
  return (
    <button
      disabled
      type="button"
      className="w-full h-14 rounded-full text-lg font-medium bg-[#FB6836] text-white flex items-center justify-center cursor-not-allowed"
    >
      <Loader2 className="size-6 animate-spin" />
    </button>
  );
};

const CreateFormButtonSkeleton = () => {
  const { t } = useTranslation("common");
  return <CreatePrimaryButton onSubmit={() => {}} isSubmittable={false} label={t("recipeCreating.berry.createWithOne")} />;
};

const CreateFormButtonReady = ({
  balance,
  creditCost,
  onSubmit,
  isValidUrl,
}: {
  balance: number;
  creditCost: number;
  onSubmit: () => void;
  isValidUrl: boolean;
}) => {
  const { t } = useTranslation("common");

  // 잔액 부족 시 충전하기 버튼
  if (balance - creditCost < 0) {
    return (
      <CreatePrimaryButton
        onSubmit={() => {
          track(AMPLITUDE_EVENT.RECHARGE_CLICK, {
            source: "create_modal",
          });
          // TODO: 충전 기능이 백엔드에 구현되면 연결
        }}
        label={t("recipeCreating.modal.recharge")}
        isSubmittable={true}
      />
    );
  }

  // 잔액 충분 시 생성하기 버튼
  return (
    <CreatePrimaryButton onSubmit={onSubmit} label={t("recipeCreating.modal.submitReady")} isSubmittable={isValidUrl} />
  );
};

function CreatePrimaryButton({
  onSubmit,
  isSubmittable,
  label,
}: {
  onSubmit: () => void;
  isSubmittable: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onSubmit}
      disabled={!isSubmittable}
      type="button"
      className={`w-full h-14 rounded-full text-lg font-medium transition-colors ${
        isSubmittable
          ? "bg-[#FB6836] hover:bg-[#e55a2d] text-white"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      {label}
    </button>
  );
}

const CreateFormButton = ({
  onSubmit,
  isValidUrl,
  isLoading,
}: {
  onSubmit: () => void;
  isValidUrl: boolean;
  isLoading: boolean;
}) => {
  const { data: balance } = useFetchBalance();
  const creditCost = 1; // 기본 베리 비용

  if (isLoading) {
    return <LoadingFormButton />;
  }

  return (
    <SSRSuspense fallback={<CreateFormButtonSkeleton />}>
      <CreateFormButtonReady
        balance={balance.balance}
        creditCost={creditCost}
        onSubmit={onSubmit}
        isValidUrl={isValidUrl}
      />
    </SSRSuspense>
  );
};

const BalanceDescriptionReady = ({
  creditCost,
  balance,
}: {
  creditCost: number;
  balance: number;
}) => {
  const { t } = useTranslation("common");

  if (balance - creditCost < 0) {
    return (
      <div className="px-4 flex flex-col items-center gap-2">
        <p className="text-lg text-gray-700 font-semibold">
          {t("recipeCreating.berry.insufficientMessage")}
        </p>
        <div className="flex items-center gap-1.5">
          <Image
            src="/images/berry/berry.png"
            alt="berry"
            width={18}
            height={18}
            className="object-contain"
          />
          <p className="text-sm text-gray-500">
            {t("recipeCreating.berry.currentBalance", { balance })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 flex flex-col items-center gap-2">
      <p className="text-lg text-gray-700 font-semibold">
        {t("recipeCreating.berry.confirmCreate", { cost: creditCost })}
      </p>
      <div className="flex items-center gap-1.5">
        <Image
          src="/images/berry/berry.png"
          alt="berry"
          width={18}
          height={18}
          className="object-contain"
        />
        <p className="text-sm text-gray-500">
          {t("recipeCreating.berry.currentBalance", { balance })}
        </p>
      </div>
    </div>
  );
};

