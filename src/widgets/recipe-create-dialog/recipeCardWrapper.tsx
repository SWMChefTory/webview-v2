import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateRecipe } from "@/src/entities/user-recipe/model/useUserRecipe";
import { useState } from "react";
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
      <DialogContent className="w-[96%] space-y-4">
        <DialogTitle asChild>
          <p className="line-clamp-1">{recipeTitle}</p>
        </DialogTitle>
        <DialogDescription asChild>
          <CreatingDescription
            creditCost={recipeCreditCost}
            balance={balance.balance}
          />
        </DialogDescription>
        <DialogClose asChild>
          <CreateButton
            creditCost={recipeCreditCost}
            balance={balance.balance}
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
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

//이 요소를 부모로 두면 자식 요소를 클릭하면 다이어로그가 열리도록 함.
export function RecipeCardWrapper(props: RecipeCardWrapperProps) {
  return (
    <SSRSuspense fallback={<RecipeCardWrapperSkeleton trigger={props.trigger} />}>
      <RecipeCardWrapperReady {...props} />
    </SSRSuspense>
  );
}

const CreateButton = ({
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
      <Button onClick={onRecharge} className="flex-1 text-lg py-5 font-bold">
        {t("recipeCreating.berry.buttonRecharge")}
      </Button>
    );
  }
  return (
    <Button onClick={onCreate} className="flex-1 text-lg py-5 font-bold">
      {t("recipeCreating.berry.buttonCreate")}
    </Button>
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
