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
} from "@/src/entities/user_recipe/model/useUserRecipe";

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
import {
  MODE,
  onUnblockingRequest,
  request,
} from "@/src/shared/client/native/client";
import { UNBLOCKING_HANDLER_TYPE } from "@/src/shared/client/native/unblockingHandlerType";
import { useCreateCategory } from "@/src/entities/category/model/useCategory";
import { Button } from "@/components/ui/button";

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
    <div className="px-6 pt-2 flex flex-col flex-none items-center w-full ">
      <div className="flex flex-row items-center justify-start w-full gap-1">
        <p className="text-xl font-semibold text-white">
          카테고리를 선택해주세요
        </p>
      </div>

      <div className="flex-none h-[24px] bg-transparent" />

      <div className=" w-[100vw] overflow-x-auto">
        <SSRSuspense fallback={<CategoryListSkeleton />}>
          <CategoryListReady
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
          />
        </SSRSuspense>
        <div className="h-[24px] bg-transparent" />
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

  return (
    <div className="flex flex-row gap-2 flex-nowrap min-w-[101vw] pl-[20]">
      <CategoryChip
        props={{
          type: ChipType.FILTER,
          name: "전체",
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
          name: "추가",
          accessary: IoMdAdd,
          onClick: () => {
            request(MODE.UNBLOCKING, "CATEGORY_CREATION_INPUT");
          },
        }}
        isDarkMode={true}
        key={ALL_RECIPES}
      />
      {categoryToDelete && (
        <CategoryDeleteAlert
          category={categoryToDelete}
          onClose={() => setCategoryToDelete(null)}
        />
      )}
    </div>
  );
};

const CategoryListSkeleton = () => {
  return (
    <div className="flex flex-row gap-2 flex-nowrap min-w-[101vw] pl-[20]">
      {Array.from({ length: 3 }, (_, i) => (
        <CategoryChip props={{ type: ChipType.SKELETON }} key={i} />
      ))}
    </div>
  );
};



function CategoryDeleteAlert({
  category,
  onClose,
}: {
  category: Category;
  onClose: () => void;
}) {
  const { deleteCategory, isPending, error } = useDeleteCategory();
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
          className="bg-white z-index-100 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-6 rounded-lg w-[80%] z-30 select-none"
          onPointerDownOutside={handleCancel}
        >
          <DialogHeader>
            <DialogTitle>정말 삭제하시겠어요?</DialogTitle>
            <DialogDescription>
              <div className="text-orange-500">
                {category.name} 카테고리에 속한 레시피가 {category.count}개
                있어요.
              </div>
              <div>카테고리를 삭제하면 레시피가 사라지진 않아요.</div>
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
                취소
              </Button>
            </DialogClose>
            <DialogClose className="flex-1 flex" onClick={handleDelete}>
              <Button
                type="button"
                variant="outline"
                className="flex flex-1 text-black"
              >
                확인
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}
