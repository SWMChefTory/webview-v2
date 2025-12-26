import { useState } from "react";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton";
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
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { FaRegClock } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useCreateRecipe } from "@/src/entities/user-recipe/model/useUserRecipe";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import type { ChallengeRecipe } from "../model/schema";
import { useTranslation } from "next-i18next";

interface ChallengeRecipeCardProps {
  recipe: ChallengeRecipe;
}

export function ChallengeRecipeCard({ recipe }: ChallengeRecipeCardProps) {
  const { t } = useTranslation("user-recipe");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { create } = useCreateRecipe();

  const handleClick = () => {
    track(AMPLITUDE_EVENT.CHALLENGE_RECIPE_CLICK, {
      recipe_id: recipe.recipeId,
    });

    // 아직 생성 안 된 레시피 → 모달 표시
    if (!recipe.isViewed) {
      setIsOpen(true);
      return;
    }

    // 이미 생성된 레시피 → 상세 페이지 이동
    router.push(`/recipe/${recipe.recipeId}/detail`);
  };

  const handleCreate = () => {
    create({
      youtubeUrl: recipe.videoUrl!,
      targetCategoryId: null,
      recipeId: recipe.recipeId,
      videoType: recipe.videoType as VideoType,
      recipeTitle: recipe.recipeTitle,
      _source: "challenge",
      _creationMethod: "card",
    });
    // 나의 레시피 등록 후 바로 상세 페이지로 이동
    router.push(`/recipe/${recipe.recipeId}/detail`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <article
        className="w-full cursor-pointer transition-transform duration-200 active:scale-[0.98]"
        onClick={handleClick}
      >
        {/* 썸네일 (고정 높이) */}
        <div className="relative h-40 w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm">
          <img
            src={recipe.videoThumbnailUrl}
            alt={recipe.recipeTitle}
            className="block w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="mt-3 space-y-1.5">
          {/* 제목 - 2줄 허용 */}
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight">
            {recipe.recipeTitle}
          </h3>

          {/* 인분 / 시간 */}
          {(recipe.servings || recipe.cookingTime) && (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {recipe.servings && (
                <div className="flex items-center gap-1">
                  <BsPeople size={14} className="shrink-0" />
                  <span>{recipe.servings}인분</span>
                </div>
              )}
              {recipe.cookingTime && (
                <div className="flex items-center gap-1">
                  <FaRegClock size={14} className="shrink-0" />
                  <span>{recipe.cookingTime}분</span>
                </div>
              )}
            </div>
          )}

          {/* 태그 - 배경 스타일 */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {recipe.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full whitespace-nowrap"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* 생성 모달 */}
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
            <Button onClick={handleCreate} className="flex-1">
              {t("dialog.create")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ChallengeRecipeCardSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="mt-3 space-y-2">
        <TextSkeleton fontSize="text-base" />
        <div className="flex gap-3">
          <TextSkeleton fontSize="text-sm" />
          <TextSkeleton fontSize="text-sm" />
        </div>
      </div>
    </div>
  );
}
