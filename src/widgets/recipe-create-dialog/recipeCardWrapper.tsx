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

//이 요소를 부모로 두면 자식 요소를 클릭하면 다이어로그가 열리도록 함.
export function RecipeCardWrapper({
  recipe,
  trigger,
}: {
  recipe: PopularRecipe | ThemeRecipe;
  trigger: React.ReactNode;
}) {
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
          <DialogTitle className="text-xl font-bold">레시피 생성</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="text-lg text-gray-400">
            <span className="text-black font-bold">{recipe.recipeTitle}</span>{" "}
            레시피를 생성하시겠어요?
          </div>
        </DialogDescription>
        <DialogFooter className="flex flex-row justify-center gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              취소
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                if (!recipe.isViewed) {
                  create({
                    youtubeUrl: recipe.videoUrl,
                    targetCategoryId: null,
                    recipeId: recipe.recipeId,
                    videoType: recipe.videoType,
                    recipeTitle: recipe.recipeTitle,
                  });
                }
              }}
              className="flex-1"
            >
              생성
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
