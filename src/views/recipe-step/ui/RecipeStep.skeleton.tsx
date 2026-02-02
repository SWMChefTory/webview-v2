import { useRouter } from "next/router";
import Header, { BackButton } from "@/src/shared/ui/header/header";
import { GlobalNoBounce } from "./globalNoBounce";
import { useRecipeStepTranslation } from "../hooks/useRecipeStepTranslation";

export function RecipeStepSkeleton() {
  const router = useRouter();
  const { t } = useRecipeStepTranslation();

  return (
    <>
      <GlobalNoBounce />
      <div className="h-[100svh] overflow-hidden bg-black px-4 py-6 lg:px-8 lg:py-8 text-white lg:max-w-[1920px] lg:mx-auto">
        <div className="mb-4">
          <Header
            leftContent={<BackButton onClick={() => router.back()} />}
            centerContent={
              <div className="max-w-[calc(100vw-144px)] overflow-hidden text-ellipsis whitespace-nowrap text-center text-xl lg:text-2xl font-semibold">
                {t("loading")}
              </div>
            }
          />
        </div>
      </div>
    </>
  );
}
