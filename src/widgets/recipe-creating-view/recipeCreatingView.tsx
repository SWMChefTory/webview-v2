import * as Dialog from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import { useCreateRecipe } from "@/src/entities/user_recipe/model/useUserRecipe";
import { useRecipeCreatingViewOpenStore } from "./recipeCreatingViewOpenStore";
import { FormInput, FormButton } from "@/src/shared/form/components";
import { driverObj } from "@/src/pages/home/ui";
import { useIsInTutorialStore } from "@/src/shared/tutorial/isInTutorialStore";

export function RecipeCreatingView() {
  const [hasEverTyped, setHasEverTyped] = useState(false);
  const { create } = useCreateRecipe();
  const {
    isOpen,
    videoUrl: url,
    setIsOpen,
    setUrl,
    close,
  } = useRecipeCreatingViewOpenStore();
  const checkingCountRef = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const isValidYoutubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const isError = () => {
    const error = hasEverTyped && url.length > 0 && !isValidYoutubeUrl(url);
    return error;
  };

  const handleUrlChange = (url: string) => {
    setUrl(url);
    setHasEverTyped(true);
  };

  const isSubmittable = () => {
    return url.length > 0 && isValidYoutubeUrl(url);
  };

  const handleSubmit = async () => {
    if (isSubmittable()) {
      create({ youtubeUrl: url });
      setHasEverTyped(false);
      if (useIsInTutorialStore.getState().isInTutorial && !useIsInTutorialStore.getState().isTutorialRecipeCardCreated) {
        setIsLoading(true);
        async function checkTutorialRecipeCardCreated() {
          setTimeout(() => {
            if (
              useIsInTutorialStore.getState().isTutorialRecipeCardCreated &&
              checkingCountRef.current >= 10
            ) {
              driverObj.moveNext();
              close();
              return;
            }
            setIsLoading(false);
            checkingCountRef.current++;
            checkTutorialRecipeCardCreated();
          }, 200);
        }
        checkTutorialRecipeCardCreated();
        return;
      }
      close();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[1500] " />
        <Dialog.Content
          data-tour="create-recipe"
          className="fixed left-0 right-0 bottom-0 z-[2000] bg-white w-full rounded-t-lg"
        >
          <div className="p-5">
            <Dialog.Title className="text-xl font-bold">
              레시피 만들기
            </Dialog.Title>
          </div>

          <div className="px-4 pb-5">
            <FormInput
              value={url}
              onChange={handleUrlChange}
              isError={isError()}
              errorMessage="유튜브 링크를 입력해주세요."
            />
          </div>

          {/* Submit Button */}
          <div className="p-3">
            <FormButton
              onSubmit={handleSubmit}
              label="완료"
              isSubmittable={isSubmittable()}
              isLoading={isLoading}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
