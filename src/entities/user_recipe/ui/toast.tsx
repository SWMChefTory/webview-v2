import * as Toast from "@radix-ui/react-toast";
import {
  RecipeCreateToastStatus,
  useRecipeCreateToastInfo,
} from "../model/useToast";
import { ReactElement } from "react";
import { motion } from "framer-motion";

type ViewportEl = ReactElement<React.ComponentProps<typeof Toast.Viewport>>;

export function RecipeCreateToast({ children }: { children: ViewportEl }) {
  const { toastInfo } = useRecipeCreateToastInfo();
  if (!toastInfo) {
    return null;
  }

  const { title, description } = (() => {
    switch (toastInfo.status) {
      case RecipeCreateToastStatus.PREPARE:
        return {
          title: "레시피 생성 준비중이에요",
          description: `url 주소 : ${toastInfo.url}`,
        };
      case RecipeCreateToastStatus.FAILED:
        return {
          title: <div className="text-red-300">레시피 생성에 실패했어요</div>,
          description: `${toastInfo.errorMessage}`,
        };
      case RecipeCreateToastStatus.IN_PROGRESS:
        return {
          title: "레시피 생성을 시작했어요",
          description: `${toastInfo.recipeTitle}`,
        };
      case RecipeCreateToastStatus.SUCCESS:
        return {
          title: "레시피 생성이 완료되었어요",
          description: `${toastInfo.recipeTitle}`,
        };
    }
  })();

  return (
    <>
      <Toast.Provider swipeDirection="right">
        {toastInfo && (
          <Toast.Root className="z-1000 w-[300px]">
            <motion.div
              whileInView={{ x: 0 }}
              initial={{ x: 100 }}
              transition={{
                type: "tween",
                duration: 0.25,
                ease: "easeOut",
              }}
            >
              <div className=" rounded-lg px-2 py-1 shadow bg-gray-800/80">
                <Toast.Title className="text-white font-bold">
                  {title}
                </Toast.Title>
                <Toast.Description className="text-white text-sm w-full">
                  <span className="block text-gray-200 truncate">
                    {description}
                  </span>
                </Toast.Description>
              </div>
            </motion.div>
          </Toast.Root>
        )}
        {children}
      </Toast.Provider>
    </>
  );
}
