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
import { PopularRecipe } from "@/src/entities/popular_recipe/model/usePopularRecipe";
import { useCreateRecipe } from "@/src/entities/user_recipe/model/useUserRecipe";
import { useState } from "react";
import { ThemeRecipe } from "../entities/theme-recipe/type";

export function PopularRecipeCardWrapper({
  recipe,
  trigger,
}: {
  recipe: PopularRecipe | ThemeRecipe;
  trigger: React.ReactNode;
}) {
  const { create } = useCreateRecipe();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div
          onClick={() => {
            if (!recipe.isViewed) {
              setIsOpen(true);
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
