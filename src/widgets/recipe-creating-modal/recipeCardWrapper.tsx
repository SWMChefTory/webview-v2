import { Button } from "@/components/ui/button";
import { Sheet } from "react-modal-sheet";
import { useCreateRecipe } from "@/src/entities/user-recipe/model/useUserRecipe";
import { useState, Suspense } from "react";
import { useRouter } from "next/router";
import { useFetchRecipeProgress } from "@/src/entities/user-recipe/model/useUserRecipe";
import { RecipeStatus } from "@/src/shared/enums/recipe";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useTranslation } from "next-i18next";
import { VideoType } from "@/src/entities/recommend-recipe/type/videoType";
import { useFetchBalance } from "@/src/entities/balance/model/useFetchBalance";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import Image from "next/image";
import { useFetchRecipeOverview } from "@/src/entities/recipe-overview/model/model";
import { Skeleton } from "@/components/ui/skeleton";

export type RecipeCardEntryPoint =
  | "popular_normal"
  | "popular_shorts"
  | "theme_chef"
  | "theme_trend"
  | "search_trend"
  | "search_result"
  | "category_recommend"
  | "category_cuisine";

type RecipeCardWrapperProps = {
  recipeId: string;
  recipeCreditCost: number;
  recipeTitle: string;
  recipeIsViewed: boolean;
  recipeVideoType: VideoType;
  recipeVideoUrl: string;
  trigger: React.ReactNode;
  entryPoint: RecipeCardEntryPoint;
};

function RecipeCardWrapperSkeleton({ trigger }: { trigger: React.ReactNode }) {
  return <>{trigger}</>;
}

function RecipeCardWrapperReady({
  recipeId,
  recipeCreditCost,
  recipeTitle,
  recipeIsViewed,
  recipeVideoType,
  recipeVideoUrl,
  trigger,
  entryPoint,
}: RecipeCardWrapperProps) {
  const { create } = useCreateRecipe();
  const { recipeStatus } = useFetchRecipeProgress({
    recipeId,
  });
  const { data: balance } = useFetchBalance();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div
        onClick={() => {
          if (!recipeIsViewed) {
            track(AMPLITUDE_EVENT.RECIPE_CREATE_START_CARD, {
              entry_point: entryPoint,
              video_type: recipeVideoType,
              recipe_id: recipeId,
            });
            setIsOpen(true);
            return;
          }
          if (recipeStatus === RecipeStatus.SUCCESS) {
            router.push(`/recipe/${recipeId}/detail`);
          }
        }}
      >
        {trigger}
      </div>
      <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} detent="content">
        <Sheet.Container
          style={{
            marginBottom: 40,
            borderRadius: 20,
            left: 8,
            right: 8,
            width: "auto",
          }}
        >
          <Sheet.Content>
            <Suspense fallback={<SheetContentSkeleton />}>
              <SheetContentWithImage
                recipeId={recipeId}
                recipeTitle={recipeTitle}
                recipeCreditCost={recipeCreditCost}
                balance={balance.balance}
                entryPoint={entryPoint}
                recipeVideoType={recipeVideoType}
                recipeVideoUrl={recipeVideoUrl}
                recipeIsViewed={recipeIsViewed}
                onCreate={() => {
                  if (!recipeIsViewed) {
                    track(AMPLITUDE_EVENT.RECIPE_CREATE_SUBMIT_CARD, {
                      entry_point: entryPoint,
                      video_type: recipeVideoType,
                    });
                    create({
                      youtubeUrl: recipeVideoUrl,
                      targetCategoryId: null,
                      recipeId: recipeId,
                      videoType: recipeVideoType,
                      recipeTitle: recipeTitle,
                      _source: entryPoint,
                      _creationMethod: "card",
                    });
                  }
                  setIsOpen(false);
                }}
                onRecharge={() => {
                  track(AMPLITUDE_EVENT.RECHARGE_CLICK, {
                    source: "create_modal",
                  });
                  setIsOpen(false);
                }}
              />
            </Suspense>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setIsOpen(false)} />
      </Sheet>
    </>
  );
}

//이 요소를 부모로 두면 자식 요소를 클릭하면 다이어로그가 열리도록 함.
export function RecipeCardWrapper(props: RecipeCardWrapperProps) {
  return (
    <SSRSuspense
      fallback={<RecipeCardWrapperSkeleton trigger={props.trigger} />}
    >
      <RecipeCardWrapperReady {...props} />
    </SSRSuspense>
  );
}

const SheetContentWithImage = ({
  recipeId,
  recipeTitle,
  recipeCreditCost,
  balance,
  entryPoint,
  recipeVideoType,
  recipeVideoUrl,
  recipeIsViewed,
  onCreate,
  onRecharge,
}: {
  recipeId: string;
  recipeTitle: string;
  recipeCreditCost: number;
  balance: number;
  entryPoint: RecipeCardEntryPoint;
  recipeVideoType: VideoType;
  recipeVideoUrl: string;
  recipeIsViewed: boolean;
  onCreate: () => void;
  onRecharge: () => void;
}) => {
  const { data: recipeOverview } = useFetchRecipeOverview(recipeId);

  return (
    <div className="flex flex-col">
      <div className="w-full aspect-video rounded-t-[20px] overflow-hidden">
        <img
          src={recipeOverview.videoThumbnailUrl}
          alt={recipeTitle}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="pt-2 pb-3 px-4 space-y-4">
        <h2 className="text-xl font-bold line-clamp-1">{recipeTitle}</h2>
        <CreatingDescription creditCost={recipeCreditCost} balance={balance} />
      </div>
      <SplitButton
        creditCost={recipeCreditCost}
        balance={balance}
        onCreate={onCreate}
        onRecharge={onRecharge}
      />
    </div>
  );
};

const SheetContentSkeleton = () => {
  return (
    <div className="flex flex-col">
      <Skeleton className="w-full aspect-video rounded-t-[20px]" />
      <div className="pt-4 pb-5 px-4 space-y-4">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-16 w-full" />
      </div>
      <Skeleton className="h-12 mx-4 rounded-[8px]" />
    </div>
  );
};

const SplitButton = ({
  creditCost,
  balance,
  onCreate,
  onRecharge,
}: {
  creditCost: number;
  balance: number;
  onCreate: () => void;
  onRecharge: () => void;
}) => {
  const { t } = useTranslation("common");

  if (balance - creditCost < 0) {
    return (
      <div className="flex rounded-b-[20px] overflow-hidden">
        <div
          onClick={onRecharge}
          className="flex-1 flex items-center justify-center py-3 text-lg font-bold bg-orange-500 text-white cursor-pointer"
        >
          {t("recipeCreating.modal.recharge")}
        </div>
      </div>
    );
  }

  return (
    <div className="flex rounded-b-[20px] overflow-hidden justify-center px-3 pb-3">
      <div
        onClick={onCreate}
        className="flex rounded-[10px] w-full items-center justify-center py-3 text-lg font-bold bg-orange-500 text-white cursor-pointer"
      >
        {t("recipeCreating.modal.register")}
      </div>
    </div>
  );
};

const CreatingDescription = ({
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
    <div className="px-4 flex flex-col items-center gap-2 text-sm text-gray-500">
      <p className="flex items-center gap-1.5">
        {t("recipeCreating.berry.confirmCreate", { cost: creditCost })}
      </p>
      <div className="flex items-center gap-1.5">
        <Image
          src="/images/berry/berry.png"
          alt="berry"
          width={12}
          height={12}
          className="object-contain"
        />
        <p>{t("recipeCreating.berry.currentBalance", { balance })}</p>
      </div>
    </div>
  );
};
