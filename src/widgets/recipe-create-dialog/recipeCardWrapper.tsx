import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PopularRecipe } from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { useCreateRecipe } from "@/src/entities/user-recipe/model/useUserRecipe";
import { useState } from "react";
import { ThemeRecipe } from "../../views/home/entities/theme-recipe/type";
import { useRouter } from "next/router";
import { useFetchRecipeProgress } from "@/src/entities/user-recipe/model/useUserRecipe";
import { RecipeStatus } from "@/src/shared/enums/recipe";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useTranslation } from "next-i18next";

export type RecipeCardEntryPoint =
  | "popular_normal"
  | "popular_shorts"
  | "theme_chef"
  | "theme_trend";

//이 요소를 부모로 두면 자식 요소를 클릭하면 다이어로그가 열리도록 함.
export function RecipeCardWrapper({
  recipe,
  trigger,
  entryPoint,
}: {
  recipe: PopularRecipe | ThemeRecipe;
  trigger: React.ReactNode;
  entryPoint: RecipeCardEntryPoint;
}) {
  const { t } = useTranslation("user-recipe");
  const { create } = useCreateRecipe();
  const { recipeStatus } = useFetchRecipeProgress({
    recipeId: recipe.recipeId,
  });
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div
        onClick={() => {
          if (!recipe.isViewed) {
            track(AMPLITUDE_EVENT.RECIPE_CREATE_START_CARD, {
              entry_point: entryPoint,
              video_type: recipe.videoType,
              recipe_id: recipe.recipeId,
            });
            setIsOpen(true);
            return;
          }
          if (recipeStatus === RecipeStatus.SUCCESS) {
            router.push(`/recipe/${recipe.recipeId}/detail`);
          }
        }}
      >
        {trigger}
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t("dialog.title")}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="text-lg text-gray-400">
            <span className="text-black font-bold">{recipe.recipeTitle}</span>{" "}
            {t("dialog.description")}
          </div>
        </DialogDescription>
        <DialogFooter className="flex flex-row justify-center gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              {t("dialog.cancel")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                if (!recipe.isViewed) {
                  track(AMPLITUDE_EVENT.RECIPE_CREATE_SUBMIT_CARD, {
                    entry_point: entryPoint,
                    video_type: recipe.videoType,
                  });
                  create({
                    youtubeUrl: recipe.videoUrl,
                    targetCategoryId: null,
                    recipeId: recipe.recipeId,
                    videoType: recipe.videoType,
                    recipeTitle: recipe.recipeTitle,
                    _source: entryPoint,
                    _creationMethod: "card",
                  });
                }
              }}
              className="flex-1"
            >
              {t("dialog.create")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
