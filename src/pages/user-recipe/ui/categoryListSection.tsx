import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { IoMdRemove } from "react-icons/io";
import { IconType } from "react-icons/lib";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import {
  CategoryChip,
  ChipType,
  EditableChipProps,
  FilterChipProps,
  SkeletonType,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [categoryMode, setCategoryMode] = useState(CategoryMode.SELECT);

  return (
    <div className="px-6 pt-2 flex flex-col flex-none items-center w-full ">
      <div className="flex flex-row items-center justify-start w-full gap-1">
        <p className="text-xl font-semibold text-white">
          {(() => {
            if (categoryMode === CategoryMode.MINUS) {
              return "제거할 카테고리를 선택해주세요";
            }
            return "카테고리를 선택해주세요";
          })()}
        </p>
        <div className="flex flex-row items-center gap-1">
          {CategoryMode.SELECT === categoryMode ||
          CategoryMode.PLUS === categoryMode ? (
            <>
              <CategoryActionButton
                Icon={CiCirclePlus}
                onClick={() => setCategoryMode(CategoryMode.PLUS)}
              />
              <CategoryActionButton
                Icon={CiCircleMinus}
                onClick={() => setCategoryMode(CategoryMode.MINUS)}
              />
            </>
          ) : (
            <CategoryDeleteCancelButton
              onClick={() => setCategoryMode(CategoryMode.SELECT)}
            />
          )}
        </div>
      </div>

      <div className="flex-none h-[24px] bg-transparent" />

      <div className=" w-[100vw] overflow-x-auto">
        <CategoryList
          type={(() => {
            if (categoryMode === CategoryMode.MINUS) {
              return ChipType.EDITION;
            }
            return ChipType.FILTER;
          })()}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        />
        <div className="h-[24px] bg-transparent" />
      </div>
    </div>
  );
};

const CategoryList = ({
  type,
  selectedCategoryId,
  setSelectedCategoryId,
}: {
  type: ChipType;
  selectedCategoryId?: string | typeof ALL_RECIPES;
  setSelectedCategoryId?: (categoryId: string | typeof ALL_RECIPES) => void;
}) => {
  const { data: categories, isLoading, error } = useFetchCategories();
  const { totalElements } = useFetchUserRecipes(ALL_RECIPES);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const allRecipeCategory = Category.createAllRecipeCategory({
    count: totalElements || 0,
  });

  if (isLoading) {
    return (
      <div className="flex flex-row gap-2 flex-nowrap min-w-[101vw] pl-[20]">
        로딩중..
      </div>
    );
  }

  type ChipDesc =
    | { kind: "FILTER"; key: React.Key; props: FilterChipProps }
    | { kind: "EDITION"; key: React.Key; props: EditableChipProps }
    | { kind: "SKELETON"; key: React.Key; props: SkeletonType };

  const createChipDescs = ({
    type,
    categories,
  }: {
    type: ChipType;
    categories: Category[];
  }): ChipDesc[] => {
    switch (type) {
      case ChipType.FILTER:
        return [ allRecipeCategory,...categories].map((c) => ({
          kind: "FILTER",
          key: c.id, 
          props: {
            type: ChipType.FILTER,
            accessary: c.count,
            name: c.name,
            onClick: () => setSelectedCategoryId?.(c.id),
            isSelected: selectedCategoryId === c.id,
          },
        }));
      case ChipType.EDITION:
        return categories.map((c) => ({
          kind: "EDITION",
          key: c.id,
          props: {
            type: ChipType.EDITION,
            name: c.name,
            accessary: IoMdRemove,
            onClick: () => setCategoryToDelete(c),
          },
        }));
      default:
        return Array.from({ length: 3 }, (_, i) => ({
          kind: "SKELETON",
          key: `skeleton-${i}`, 
          props: { type: ChipType.SKELETON },
        }));
    }
  };

  return (
    <div className="flex flex-row gap-2 flex-nowrap min-w-[101vw] pl-[20]">
      {createChipDescs({ type: isLoading ? ChipType.SKELETON : type, categories: categories || [] }).map((props) => (
        <CategoryChip props={props.props} isDarkMode={true} key={props.key} />
      ))}
      {categoryToDelete && (
        <CategoryDeleteAlert
          category={categoryToDelete}
          onClose={() => setCategoryToDelete(null)}
        />
      )}
    </div>
  );
};

function CategoryActionButton({
  Icon,
  onClick,
}: {
  Icon: IconType;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9, opacity: 0.8 }}
    >
      <Icon size={24} className="text-white" onClick={onClick} />
    </motion.div>
  );
}

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
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {category.name}을 정말 삭제하시겠어요?
          </AlertDialogTitle>
          <AlertDialogDescription>
            이 카테고리에 속하는 레시피는 사라지지 않아요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-center gap-2">
          <AlertDialogCancel className="flex-1 flex" onClick={handleCancel}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            className="flex-1 flex"
            onClick={handleDelete}
            disabled={isPending}
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CategoryDeleteCancelButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9, opacity: 0.8 }}
      onClick={onClick}
      className="p-[4]"
    >
      <p className="border border-gray-400 rounded-full text-xs text-gray-200 p-[2]">
        취소
      </p>
    </motion.div>
  );
}
