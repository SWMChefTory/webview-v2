import * as Dialog from "@radix-ui/react-dialog";

import { useState, useEffect, useRef } from "react";
import {
  useCreateRecipe,
  extractYouTubeVideoId,
} from "@/src/entities/user-recipe/model/useUserRecipe";

import { useRecipeCreatingViewOpenStore } from "./recipeCreatingViewOpenStore";
import { FormInput, FormButton } from "@/src/shared/form/components";
import { ShareTutorialModal } from "./shareTutorialModal";
import { useFetchCategories } from "@/src/entities/category/model/useCategory";
import { HorizontalScrollArea } from "@/src/views/home/ui/horizontalScrollArea";
import { motion } from "motion/react";

import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

import { useTranslation } from "next-i18next";
import { isValidYoutubeUrl } from "@/src/shared/utils/youtube";

import Image from "next/image";
import { useFetchBalance } from "@/src/entities/balance/model/useFetchBalance";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";

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
            className="fixed left-0 right-0 bottom-0 z-[2000] bg-white w-full rounded-t-lg md:max-w-[500px] lg:max-w-[560px] xl:max-w-[640px] md:mx-auto md:bottom-4 lg:bottom-6 xl:bottom-8 md:rounded-lg lg:rounded-xl xl:rounded-2xl lg:shadow-2xl"
          >
            <div className="p-5 lg:p-6 xl:p-8">
              <Title />
            </div>
            <CategoryChipListSection
              selectedCategoryId={selectedCategoryId}
              onSelect={({ selectedCategoryId }) => {
                setSelectedCategoryId(selectedCategoryId);
              }}
            />
            <div className="px-4 lg:px-5 xl:px-6 pb-5 lg:pb-6">
              <FormInput
                value={url}
                onChange={handleUrlChange}
                isError={isError()}
                errorMessage={t("recipeCreating.form.invalidUrl")}
                placeholder={t("recipeCreating.form.placeholder")}
              />
            </div>
            <div className="pb-3 lg:pb-4">
              <BalanceDescription />
            </div>
            <div className="p-3 lg:p-4 xl:p-5">
              <CreateFormButton
                onSubmit={handleSubmit}
                isValidUrl={isSubmittable()}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

const TitleSkeleton = () => {
  const { t } = useTranslation("common");
  return (
    <Dialog.Title className="text-xl lg:text-2xl font-bold flex justify-between items-center">
      <p>{t("recipeCreating.form.title")}</p>
      <p className="px-2 py-1 lg:px-3 lg:py-1.5 text-base lg:text-lg text-red-500 font-base flex justify-center items-center gap-0.5 lg:gap-1">
        <Image
          src="/images/berry/berry.png"
          alt="berry"
          width={22}
          height={22}
          className="object-contain lg:w-[26px] lg:h-[26px]"
        />
        0
      </p>
    </Dialog.Title>
  );
};

const TitleReady = () => {
  const { data: balance } = useFetchBalance();
  const { t } = useTranslation("common");
  return (
    <Dialog.Title className="text-xl lg:text-2xl font-bold flex justify-between items-center">
      <p>{t("recipeCreating.form.title")}</p>
      <p className="px-2 py-1 lg:px-3 lg:py-1.5 text-base lg:text-lg text-red-500 font-base flex justify-center items-center gap-0.5 lg:gap-1">
        <Image
          src="/images/berry/berry.png"
          alt="berry"
          width={22}
          height={22}
          className="object-contain lg:w-[26px] lg:h-[26px]"
        />
        {balance.balance}
      </p>
    </Dialog.Title>
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
      className={`rounded-xl px-2 py-1 lg:px-3 lg:py-1.5 whitespace-nowrap font-semibold border lg:text-base lg:cursor-pointer lg:hover:shadow-md lg:transition-shadow ${
        isSelected
          ? "border-black bg-black text-white"
          : "border-gray-300 text-gray-500 lg:hover:border-gray-400"
      }`}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {name}
    </motion.div>
  );
}

const CreateFormButtonSkeleton = () => {
  const { t } = useTranslation("common");
  return (
    <FormButton
      onSubmit={() => {}}
      label={t("recipeCreating.berry.createWithOne")}
      isSubmittable={false}
    />
  );
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
      <FormButton
        onSubmit={() => {
          track(AMPLITUDE_EVENT.RECHARGE_CLICK, {
            source: "create_modal",
          });
          // TODO: 충전 기능이 백엔드에 구현되면 연결
        }}
        label={t("recipeCreating.berry.buttonRecharge")}
        isSubmittable={true}
      />
    );
  }

  // 잔액 충분 시 생성하기 버튼
  return (
    <FormButton
      onSubmit={onSubmit}
      label={t("recipeCreating.berry.createWithOne")}
      isSubmittable={isValidUrl}
    />
  );
};

const CreateFormButton = ({
  onSubmit,
  isValidUrl,
}: {
  onSubmit: () => void;
  isValidUrl: boolean;
}) => {
  const { data: balance } = useFetchBalance();
  const creditCost = 1; // 기본 베리 비용

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

const BalanceDescriptionSkeleton = () => {
  const { t } = useTranslation("common");
  return (
    <div className="px-4 lg:px-5 flex flex-col items-center gap-2 lg:gap-3">
      <p className="text-lg lg:text-xl text-gray-700 font-semibold">
        {t("recipeCreating.berry.confirmCreate", { cost: 1 })}
      </p>
      <div className="flex items-center gap-1.5 lg:gap-2">
        <Image
          src="/images/berry/berry.png"
          alt="berry"
          width={18}
          height={18}
          className="object-contain lg:w-[22px] lg:h-[22px]"
        />
        <p className="text-sm lg:text-base text-gray-500">
          {t("recipeCreating.berry.currentBalance", { balance: 0 })}
        </p>
      </div>
    </div>
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
      <div className="px-4 lg:px-5 flex flex-col items-center gap-2 lg:gap-3">
        <p className="text-lg lg:text-xl text-gray-700 font-semibold">
          {t("recipeCreating.berry.insufficientMessage")}
        </p>
        <div className="flex items-center gap-1.5 lg:gap-2">
          <Image
            src="/images/berry/berry.png"
            alt="berry"
            width={18}
            height={18}
            className="object-contain lg:w-[22px] lg:h-[22px]"
          />
          <p className="text-sm lg:text-base text-gray-500">
            {t("recipeCreating.berry.currentBalance", { balance })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-5 flex flex-col items-center gap-2 lg:gap-3">
      <p className="text-lg lg:text-xl text-gray-700 font-semibold">
        {t("recipeCreating.berry.confirmCreate", { cost: creditCost })}
      </p>
      <div className="flex items-center gap-1.5 lg:gap-2">
        <Image
          src="/images/berry/berry.png"
          alt="berry"
          width={18}
          height={18}
          className="object-contain lg:w-[22px] lg:h-[22px]"
        />
        <p className="text-sm lg:text-base text-gray-500">
          {t("recipeCreating.berry.currentBalance", { balance })}
        </p>
      </div>
    </div>
  );
};

function BalanceDescriptionContent() {
  const { data: balance } = useFetchBalance();
  const creditCost = 1;
  return <BalanceDescriptionReady creditCost={creditCost} balance={balance.balance} />;
}

const BalanceDescription = () => {
  return (
    <SSRSuspense fallback={<BalanceDescriptionSkeleton />}>
      <BalanceDescriptionContent />
    </SSRSuspense>
  );
};
