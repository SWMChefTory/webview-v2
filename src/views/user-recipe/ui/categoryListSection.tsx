import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { Loader2 } from "lucide-react";
import {
  CategoryChip,
  ChipType,
} from "@/src/entities/category/ui/categoryChip";
import {
  Category,
  useFetchCategories,
  useDeleteCategory,
} from "@/src/entities/category/model/useCategory";
import {
  useFetchUserRecipes,
  ALL_RECIPES,
} from "@/src/entities/user-recipe/model/useUserRecipe";

import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { onUnblockingRequest } from "@/src/shared/client/native/client";
import { UNBLOCKING_HANDLER_TYPE } from "@/src/shared/client/native/unblockingHandlerType";
import { useCreateCategory } from "@/src/entities/category/model/useCategory";
import { Button } from "@/components/ui/button";
import { CategoryCreatingView } from "@/src/widgets/category-creating-view/categoryCreatingView";
// useUserRecipeTranslation 제거
import { formatCategoryName } from "@/src/features/format/category/formatCategoryName";
import { useLangcode, Lang } from "@/src/shared/translation/useLangCode"; // Lang 타입 import 추가

export enum CategoryMode {
  SELECT,
  PLUS,
  MINUS,
}

export const CategoryListSection = ({
  selectedCategoryId,
  setSelectedCategoryId,
}: {
  selectedCategoryId: string | typeof ALL_RECIPES;
  setSelectedCategoryId: (categoryId: string | typeof ALL_RECIPES) => void;
}) => {
  const { createCategory } = useCreateCategory();
  useEffect(() => {
    const cleanup = onUnblockingRequest(
      UNBLOCKING_HANDLER_TYPE.CATEGORY_CREATE,
      (type, payload) => {
        createCategory(payload.categoryName);
      }
    );
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div className="px-6 pt-2 flex flex-col flex-none items-center w-full pb-[12]">
      <div className=" w-[100vw] overflow-x-auto no-scrollbar">
        <SSRSuspense fallback={<CategoryListSkeleton />}>
          <CategoryListReady
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
          />
        </SSRSuspense>
      </div>
    </div>
  );
};

const CategoryListReady = ({
  // type,
  selectedCategoryId,
  setSelectedCategoryId,
}: {
  // type: ChipType.FILTER | ChipType.EDITION;
  selectedCategoryId?: string | typeof ALL_RECIPES;
  setSelectedCategoryId?: (categoryId: string | typeof ALL_RECIPES) => void;
}) => {
  const { data: categories } = useFetchCategories();
  const { totalElements } = useFetchUserRecipes(
    categories?.find((category) => category.id === ALL_RECIPES) || ALL_RECIPES
  );
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const lang = useLangcode();

  return (
    <div className="flex flex-row flex-nowrap min-w-[101vw] pl-[10]">
      <CategoryChip
        props={{
          type: ChipType.FILTER,
          name: formatCategoryName({ lang }).all,
          accessary: totalElements,
          onClick: () => setSelectedCategoryId?.(ALL_RECIPES),
          isSelected: selectedCategoryId === ALL_RECIPES,
        }}
        isDarkMode={true}
        key={ALL_RECIPES}
      />
      {categories.map((category) => (
        <CategoryChip
          props={{
            type: ChipType.FILTER,
            name: category.name,
            accessary: category.count,
            onClick: () => setSelectedCategoryId?.(category.id),
            onClickLong: () => {
              if(selectedCategoryId===category.id){
                return;
              }
              setCategoryToDelete(category);
            },
            isSelected: selectedCategoryId === category.id,
          }}
          key={category.id}
          isDarkMode={true}
        />
      ))}
      <CategoryChip
        props={{
          type: ChipType.EDITION,
          name: formatCategoryName({ lang }).add,
          accessary: IoMdAdd,
          onClick: () => {
            setIsOpen(true);
          },
        }}
        isDarkMode={true}
        key={"add"}
      />
      {categoryToDelete && (
        <CategoryDeleteAlert
          category={categoryToDelete}
          onClose={() => setCategoryToDelete(null)}
        />
      )}
      <CategoryCreatingView isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

const CategoryListSkeleton = () => {
  return (
    <div className="flex flex-row gap-2 flex-nowrap min-w-[101vw] pl-[10]">
      {Array.from({ length: 3 }, (_, i) => (
        <CategoryChip props={{ type: ChipType.SKELETON }} key={i} />
      ))}
    </div>
  );
};

// 텍스트 포매팅 함수 정의
const formatCategoryDeleteAlertMessages = ({
  categoryName,
  count,
  lang,
}: {
  categoryName: string;
  count: number;
  lang: Lang;
}) => {
  switch (lang) {
    case "en":
      return {
        title: "Delete this category?",
        description: `There are ${count} recipe(s) in ${categoryName}.`,
        subDescription: "Deleting the category does not delete the recipes.",
        cancel: "Cancel",
        confirm: "Confirm",
      };
    default:
      return {
        title: "정말 삭제하시겠어요?",
        description: `${categoryName} 카테고리에 속한 레시피가 ${count}개 있어요.`,
        subDescription: "카테고리를 삭제하면 레시피가 사라지진 않아요.",
        cancel: "취소",
        confirm: "확인",
      };
  }
};

function CategoryDeleteAlert({
  category,
  onClose,
}: {
  category: Category;
  onClose: () => void;
}) {
  const { deleteCategory, isPending } = useDeleteCategory();
  const lang = useLangcode(); // lang 가져오기

  // 포매팅된 메시지 가져오기
  const messages = formatCategoryDeleteAlertMessages({
    categoryName: category.name,
    count: category.count,
    lang,
  });

  const handleCancel = () => {
    onClose();
  };
  const handleDelete = async () => {
    await deleteCategory(category.id);
    onClose();
  };
  if (isPending) {
    return (
      <Loader2
        className="h-5 w-5 animate-spin text-gray-600"
        aria-label="Loading"
      />
    );
  }
  return (
    <Dialog open={true}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 bg-black/50 z-20"
          onPointerDown={handleCancel}
        />
        <DialogPrimitive.Content
          className="bg-white z-index-100 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-6 rounded-lg w-[80%] z-30"
          onPointerDownOutside={handleCancel}
        >
          <DialogHeader>
            <DialogTitle>{messages.title}</DialogTitle>
            <DialogDescription>
              <div className="text-orange-500">{messages.description}</div>
              <div>{messages.subDescription}</div>
            </DialogDescription>
          </DialogHeader>
          <div className="h-4" />
          <DialogFooter className="flex flex-row justify-center gap-2">
            <DialogClose className="flex-1 flex" onClick={handleCancel}>
              <Button
                type="button"
                variant="secondary"
                className="flex flex-1 bg-black text-white"
              >
                {messages.cancel}
              </Button>
            </DialogClose>
            <DialogClose className="flex-1 flex" onClick={handleDelete}>
              <Button
                type="button"
                variant="outline"
                className="flex flex-1 text-black"
              >
                {messages.confirm}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}