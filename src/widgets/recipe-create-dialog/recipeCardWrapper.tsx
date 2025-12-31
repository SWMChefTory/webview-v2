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
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { useFetchBalance } from "@/src/entities/balance/model/useFetchBalance";
import { useLangcode } from "@/src/shared/translation/useLangCode";

export type RecipeCardEntryPoint =
  | "popular_normal"
  | "popular_shorts"
  | "theme_chef"
  | "theme_trend"
  | "search_trend"
  | "search_result"
  | "category_recommend"
  | "category_cuisine";

//이 요소를 부모로 두면 자식 요소를 클릭하면 다이어로그가 열리도록 함.
export function RecipeCardWrapper({
  recipeId,
  recipeCreditCost,
  recipeTitle,
  recipeIsViewed,
  recipeVideoType,
  recipeVideoUrl,
  trigger,
  entryPoint,
}: {
  // recipe: PopularSummaryRecipeDto | ThemeRecipe;
  recipeId: string;
  recipeCreditCost: number;
  recipeTitle: string;
  recipeIsViewed: boolean;
  recipeVideoType: VideoType;
  recipeVideoUrl: string;
  trigger: React.ReactNode;
  entryPoint: RecipeCardEntryPoint;
}) {
  const { create } = useCreateRecipe();
  const { recipeStatus } = useFetchRecipeProgress({
    recipeId,
  });
  const { data: balance } = useFetchBalance();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const lang = useLangcode();

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
      <DialogContent className="w-[96%]">
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
  const lang = useLangcode();
  if (balance - creditCost < 0) {
    return (
      <Button onClick={onRecharge} className="flex-1 text-lg py-5 ">
        {lang === "en" ? `I will recharge` : `충전할게요`}
      </Button>
    );
  }
  return (
    <Button onClick={onCreate} className="flex-1 text-lg py-5 ">
      {lang === "en" ? `I will create` : `생성할게요`}
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
  const lang = useLangcode();
  if (balance - creditCost < 0) {
    return (
      <div className="font-bold px-4 flex flex-col items-center">
        베리가 부족합니다. 충전하시겠어요?
      </div>
    );
  }
  return (
    <div className="font-bold px-4 flex flex-col items-center">
      <p className="text-lg text-gray-500">
        {lang === "en"
          ? `Would you like to create a recipe with ${creditCost} berries?`
          : `베리 ${creditCost}개로 레시피를 생성하시겠어요?`}
      </p>
      <p className="text-sm text-gray-500 font-normal">
        {lang === "en"
          ? `Current berries: ${balance}`
          : `현재 베리 ${balance}개`}
      </p>
    </div>
  );
};
