import { HorizontallyLongRecipes } from "@/src/pages/home/ui/horizontalyLongRecipes";
import { VerticallyLongRecipes } from "@/src/pages/home/ui/vericallyLongRecipes";
import Header, { HeaderSpacing, ProfileButton } from "@/src/shared/ui/header";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FloatingButton,
  FloatingButtonSkeleton,
} from "@/src/pages/home/ui/floatingButton";
import { useCreateRecipe } from "@/src/entities/user_recipe/model/useUserRecipe";
import { useEffect } from "react";
import { onUnblockingRequest } from "@/src/shared/client/native/client";
import { UNBLOCKING_HANDLER_TYPE } from "@/src/shared/client/native/unblockingHandlerType";
import { RecipeCreationInfoSchema } from "../entities/creating_info/recipeCreationInfo";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import {
  MyRecipesReady,
  MyRecipesSkeleton,
} from "@/src/pages/home/ui/myRecipe";

function HomePage() {
  const { create, error, recipeId } = useCreateRecipe();
  useEffect(() => {
    const cleanup = onUnblockingRequest(
      UNBLOCKING_HANDLER_TYPE.RECIPE_CREATE,
      (type, payload) => {
        const recipeCreationInfo = RecipeCreationInfoSchema.parse(payload);
        console.log("[RECIPE CREATION INFO] : ", JSON.stringify(recipeCreationInfo, null, 2));
        create({
          youtubeUrl: recipeCreationInfo.videoUrl,
          targetCategoryId: recipeCreationInfo.categoryId || null,
        });
      }
    );
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (error) {
      toast.error("레시피 생성 중 오류가 발생했습니다.");
    }
  }, [error]);

  useEffect(() => {
    console.log("[RECIPE ID] : ", recipeId);
    if (recipeId) {
      console.log("레시피 생성중");
      toast("레시피 생성 중...");
    }
  }, [recipeId]);

  return (
    <div className="min-h-screen w-screen w-full">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white">
        <Header
          leftContent={<Logo />}
          rightContent={
            <div className="flex flex-row">
              <ProfileButton onClick={() => {}} />
            </div>
          }
        />
      </div>
      <HeaderSpacing />
      <Toaster />
      <div className="h-8" />
      <SSRSuspense fallback={<MyRecipesSkeleton />}>
        <MyRecipesReady />
      </SSRSuspense>
      <HorizontallyLongRecipes />
      <SSRSuspense fallback={<FloatingButtonSkeleton />}>
        <FloatingButton />
      </SSRSuspense>
    </div>
  );
}

const Logo = () => {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 40], [1, 0.5]);
  const translateY = useTransform(scrollY, [0, 40], [0, -40]);

  return (
    <div className="pl-2">
      <div className="h-[44] w-[10]" />

      <motion.img
        src="/logo.png"
        alt="logo"
        className="h-[40] w-auto z-1 origin-left"
        style={{ scale: scale, translateY: translateY, originX: 0 }}
      />
    </div>
  );
};

export default HomePage;
