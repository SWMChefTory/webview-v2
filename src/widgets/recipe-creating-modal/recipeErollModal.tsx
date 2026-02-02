import { Sheet } from "react-modal-sheet";
import { useRecipeEnrollModalStore } from "./recipeErollModalStore";
import { useFetchRecipeOverview } from "@/src/entities/recipe-overview/model/model";
import { useFetchRecipeProgressWithRefetch } from "@/src/entities/user-recipe/model/useUserRecipe";
import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import { RecipeStatus } from "@/src/entities/user-recipe/type/type";
import { useRouter } from "next/router";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const RecipeErollModal = () => {
  const { recipeId } = useRecipeEnrollModalStore();

  if (!recipeId) {
    return <></>;
  }

  return <Modal recipeId={recipeId} />;
};

const Modal = ({ recipeId }: { recipeId: string }) => {
  const { close } = useRecipeEnrollModalStore();

  return (
    <Sheet unstyled isOpen={true} onClose={close} detent="content">
      <Sheet.Container
        style={{
          marginBottom: 40,
          borderRadius: 20,
          left: 8,
          right: 8,
          width: "auto",
        }}
      >
        <Sheet.Content style={{ paddingTop: 80 }}>
          <Suspense fallback={<ContentSkeleton />}>
            <Content recipeId={recipeId} onClose={close} />
          </Suspense>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        onTap={close}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      />
    </Sheet>
  );
};

// Progress 상태에 따라 분기
const Content = ({
  recipeId,
  onClose,
}: {
  recipeId: string;
  onClose: () => void;
}) => {
  const { recipeStatus } = useFetchRecipeProgressWithRefetch(recipeId);

  if (recipeStatus === RecipeStatus.FAILED) {
    return <ContentFailed onClose={onClose} />;
  }
  if (recipeStatus === RecipeStatus.IN_PROGRESS) {
    return <ContentInProgress recipeId={recipeId} onClose={onClose} />;
  }

  return (
    <ContentWithOverlay
      recipeId={recipeId}
      onClose={onClose}
    />
  );
};

// ContentReady 위에 상태별 오버레이를 표시하는 컴포넌트
const ContentWithOverlay = ({
  recipeId,
  onClose,
}: {
  recipeId: string;
  onClose: () => void;
}) => {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <ContentReady recipeId={recipeId} onClose={onClose} />
    </Suspense>
  );
};

const ContentTemplate = ({
  thumbnail,
  title,
  button,
}: {
  thumbnail: React.ReactNode;
  title: React.ReactNode;
  button: React.ReactNode;
}) => {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col gap-3 relative bg-white rounded-[20px]">
      <div className="absolute top-[12px] left-[12px] px-2 py-2 flex items-center gap-2 bg-gray-500/40 rounded-md">
        <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <span className="text-sm font-bold text-gray-600 text-white">{t("recipeCreating.modal.registered")}</span>
      </div>
      <div className="bg-white rounded-[20px] overflow-hidden">
        <div className="w-full aspect-video rounded-t-[20px] overflow-hidden">
          {thumbnail}
        </div>

        <div className="px-4 pt-2 pb-4">{title}</div>
      </div>
      <div className="bg-white rounded-b-[20px] overflow-hidden">{button}</div>
    </div>
  );
};

const ContentSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 relative bg-white rounded-[20px]">
      <div className="absolute top-[12px] left-[12px] px-2 py-2 flex items-center gap-2 bg-gray-200 rounded-md">
        <Skeleton className="w-5 h-5 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      
      <div className="bg-white rounded-[20px] overflow-hidden">
        <div className="w-full aspect-video rounded-t-[20px] overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>

        <div className="px-4 pt-2 pb-4">
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
      
      <div className="bg-white rounded-b-[20px] overflow-hidden">
        <Skeleton className="h-12" />
      </div>
    </div>
  );
};

// 생성중 컴포넌트
const ContentInProgress = ({
  recipeId,
  onClose,
}: {
  recipeId: string;
  onClose: () => void;
}) => {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col">
      <div className="mb-[-40px] z-10 ml-[20px]">
        <Image
          src="/images/tory/tory_study.png"
          alt="tory"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      <div className="bg-white rounded-[20px] pt-6 px-6 pb-4 w-full">
        <div className="flex items-center justify-center gap-2 pt-[16px]">
          <p className="text-xl font-bold text-gray-900">{t("recipeCreating.modal.creating")}</p>
          <Spinner className="size-6 text-orange-500" />
        </div>
        <div className="text-sm text-gray-500 mt-2 text-center">
          {t("recipeCreating.modal.creatingMessage")}
        </div>
      </div>
    </div>
  );
};

const ContentFailed = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col">
      <div className="mb-[-40px] z-10 ml-[20px]">
        <Image
          src="/images/tory/tory_cry.png"
          alt="tory"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      <div className="bg-white rounded-[20px] pt-6 px-6 pb-4 w-full">
        <h2 className="text-xl font-bold text-gray-900 pt-[16px] text-center">
          {t("recipeCreating.modal.failed")}
        </h2>
        <div className="text-sm text-gray-500 mt-2 text-center">
          {t("recipeCreating.modal.failedMessage")}
        </div>
      </div>
    </div>
  );
};

// 생성 완료 - 등록 UI 컴포넌트
const ContentReady = ({
  recipeId,
  onClose,
}: {
  recipeId: string;
  onClose: () => void;
}) => {
  const { data: recipe } = useFetchRecipe(recipeId);
  const router = useRouter();
  const { t } = useTranslation("common");

  const handleNavigate = () => {
    onClose();
    router.push(`/recipe/${recipeId}/detail`);
  };

  return (
    <ContentTemplate
      thumbnail={
        <Image
          src="/images/tory/tory_study.png"
          alt="tory"
          width={120}
          height={120}
          className="object-contain"
        />
      }
      title={
        <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
          {recipe.videoInfo.videoTitle}
        </h2>
      }
      button={
        <div className="flex justify-center px-3 pb-3">
          <div
            onClick={handleNavigate}
            className="flex rounded-[10px] w-full items-center justify-center py-3 text-lg font-bold bg-orange-500 text-white cursor-pointer"
          >
            {t("recipeCreating.modal.navigate")}
          </div>
        </div>
      }
    />
  );
};

export default RecipeErollModal;
