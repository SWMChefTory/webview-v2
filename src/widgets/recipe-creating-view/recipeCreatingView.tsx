import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { X } from "lucide-react";
import { useCreateRecipe } from "@/src/entities/user_recipe/model/useUserRecipe";
import { useRecipeCreatingViewOpenStore } from "./recipeCreatingViewOpenStore";

export function RecipeCreatingView() {
    const [hasEverTyped, setHasEverTyped] = useState(false);
    const { create } = useCreateRecipe();
    const { isOpen, videoUrl : url, setIsOpen, setUrl,close } = useRecipeCreatingViewOpenStore();
  
    const isValidYoutubeUrl = (url: string) => {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      return youtubeRegex.test(url);
    };
  
    const isError = () => {
      return hasEverTyped && url.length > 0 && !isValidYoutubeUrl(url);
    };
  
    const isSubmittable = () => {
      return url.length > 0 && isValidYoutubeUrl(url);
    };
  
    const handleSubmit = () => {
      if (isSubmittable()) {
        create({ youtubeUrl: url });
        setHasEverTyped(false);
        close();
      }
    };
  
    return (
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[1500] " />
          <Dialog.Content
            className="fixed left-0 right-0 bottom-0 z-[2000] bg-white w-full rounded-t-lg"
          >
            <div className="p-5">
              <Dialog.Title className="text-xl font-bold">
                레시피 만들기
              </Dialog.Title>
            </div>
  
            <div className="px-4 pb-5">
              <div className="relative">
                <input
                  ref={(el) => {
                    if (el) {
                      el.focus({ preventScroll: true });
                    }
                  }}
                  type="text"
                  placeholder="유튜브 링크를 입력해주세요."
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setHasEverTyped(true);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.currentTarget.focus({ preventScroll: true });
                  }}
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors ${
                    isError()
                      ? "border-red-500 focus:border-red-600"
                      : "border-gray-300 focus:border-black"
                  }`}
                />
                {url && (
                  <button
                    onClick={() => setUrl("")}
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
  
              {isError() && (
                <Dialog.Description className="text-red-500 text-sm mt-2 ml-1">
                  유튜브 링크를 입력해주세요.
                </Dialog.Description>
              )}
            </div>
  
            {/* Submit Button */}
            <div className="p-3">
              <button
                onClick={handleSubmit}
                disabled={!isSubmittable()}
                type="button"
                className={`w-full h-14 rounded-lg text-lg font-medium transition-colors ${
                  isSubmittable()
                    ? "bg-[#FB6836] hover:bg-[#e55a2d] text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                완료
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
  