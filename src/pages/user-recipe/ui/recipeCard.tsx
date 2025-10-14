import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import { RecipeDetailMeta } from "@/src/entities/recipe/model/useRecipe";
import { FaRegClock } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import { IconType } from "react-icons";
import { RecipeTag } from "@/src/entities/recipe/model/useRecipe";
import {
  ThumbnailSkeleton,
  ThumbnailReady,
} from "@/src/entities/user_recipe/ui/thumbnail";
import {
  CategoryInfo,
  useFetchRecipeProgressNotSuspense,
  UserRecipe,
  useUpdateCategoryOfRecipe,
} from "@/src/entities/user_recipe/model/useUserRecipe";
import { TitleReady, TitleSkeleton } from "@/src/entities/user_recipe/ui/title";
import {
  CategoryChip,
  ChipType,
} from "@/src/entities/category/ui/categoryChip";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import {
  ElapsedViewTimeReady,
  ElapsedViewTimeSkeleton,
} from "@/src/entities/user_recipe/ui/detail";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { RecipeStatus } from "@/src/entities/user_recipe/type/type";
import { ProgressDetailsCheckList } from "@/src/entities/user_recipe/ui/progress";
import { CgArrowsExchangeV } from "react-icons/cg";
import { useFetchCategories } from "@/src/entities/category/model/useCategory";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useState } from "react";
import { motion } from "framer-motion";

const NO_CATEGORY_NAME = "카테고리 선택";

const RecipeDetailsCardReady = ({ userRecipe }: { userRecipe: UserRecipe }) => {
  const { progress, isLoading } = useFetchRecipeProgressNotSuspense(
    userRecipe.recipeId
  );
  const [isCategorySelectComboboxOpen, setIsCategorySelectComboboxOpen] =
    useState(false);

  return (
    <div className="relative w-full px-[10] flex flex-row items-center justify-center z-10">
      {progress && progress.recipeStatus === RecipeStatus.IN_PROGRESS && (
        <div className="absolute flex justify-center inset-0 overflow-hidden z-100">
          <ProgressDetailsCheckList
            recipeProgressDetails={progress?.recipeProgressDetails ?? []}
          />
        </div>
      )}
      <ThumbnailReady imgUrl={userRecipe.videoInfo.thumbnailUrl} />
      <div className="px-[8] flex flex-col items-start flex-1 gap-1 overflow-x-hidden">
        <TitleReady title={userRecipe.title} />
        <CategorySelect
          recipeId={userRecipe.recipeId}
          selectedCategoryInfo={userRecipe.categoryInfo}
        />
        {isLoading || progress?.recipeStatus === RecipeStatus.IN_PROGRESS ? (
          <DetailSectionSkeleton />
        ) : (
          <SSRSuspense fallback={<DetailSectionSkeleton />}>
            <DetailSectionReady recipeId={userRecipe.recipeId} />
          </SSRSuspense>
        )}
        <ElapsedViewTimeReady details={userRecipe.getSubTitle()} />
      </div>
    </div>
  );
};

const CategorySelectTrigger = ({
  recipeId,
  categoryInfo,
}: {
  recipeId: string;
  categoryInfo?: CategoryInfo;
}) => {
  return (
    <CategoryChip
      props={{
        type: ChipType.EDITION,
        name: categoryInfo?.name || NO_CATEGORY_NAME,
        accessary: categoryInfo ? CgArrowsExchangeV : IoMdAdd,
        onClick: () => {},
      }}
    />
  );
};

const CategorySelect = ({
  recipeId,
  selectedCategoryInfo,
}: {
  recipeId: string;
  selectedCategoryInfo?: CategoryInfo;
}) => {
  const { data: categories } = useFetchCategories();
  const { updateCategory} = useUpdateCategoryOfRecipe();
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger>
        <CategorySelectTrigger
          recipeId={recipeId}
          categoryInfo={selectedCategoryInfo}
        />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-gray-900/5 z-20" />
        <DialogPrimitive.Content className="inline-flex w-fit flex-col gap-2 bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 pt-4 pb-8 rounded-lg z-30 max-w-[80%]">
          <div className="flex w-full justify-end">
            <DialogPrimitive.Close asChild>
              <motion.div
                className="rounded-full p-1"
                aria-label="Close"
                whileTap={{ scale: 0.8, backgroundColor: "#E8E8E8" }}
              >
                <IoMdClose />
              </motion.div>
            </DialogPrimitive.Close>
          </div>

          <div className="text-sm text-gray-500 px-2 pb-2">
            카테고리를 선택해주세요
          </div>
          {categories?.map((category) => (
            <>
              <DialogPrimitive.Close asChild>
                <motion.div
                  key={category.id}
                  className={`px-2 truncate rounded-md p-1 ${
                    category.id == selectedCategoryInfo?.id && "text-gray-500"
                  }`}
                  onClick={async () => {
                    updateCategory({ recipeId, targetCategoryId: category.id });
                  }}
                  whileTap={
                    category.id !== selectedCategoryInfo?.id
                      ? { scale: 0.95, backgroundColor: "#E8E8E8" }
                      : undefined
                  }
                >
                  {category.name}
                </motion.div>
              </DialogPrimitive.Close>
            </>
          ))}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

const RecipeDetailsCardSkeleton = () => {
  return (
    <div className="w-full px-[10] flex flex-row items-center">
      <ThumbnailSkeleton />
      <div className="px-[8] flex flex-col items-start flex-1 gap-1 overflow-x-hidden">
        <TitleSkeleton />
        <CategoryChip props={{ type: ChipType.SKELETON }} />
        <DetailSectionSkeleton />
        <ElapsedViewTimeSkeleton />
      </div>
    </div>
  );
};

function DetailSectionReady({ recipeId }: { recipeId: string }) {
  const { data: recipe } = useFetchRecipe(recipeId);
  return (
    <>
      <RecipePropertiesReady
        recipeDetailMeta={
          recipe.detailMeta ?? {
            id: "",
            description: "",
            servings: 0,
            cookTime: 0,
          }
        }
      />
      <TagListReady tags={recipe.tags ?? []} />
    </>
  );
}

function DetailSectionSkeleton() {
  return (
    <>
      <RecipePropertiesSkeleton />
      <TagListSkeleton />
    </>
  );
}

const TagListReady = ({ tags }: { tags: RecipeTag[] }) => {
  return (
    <div className="flex flex-row gap-1 w-full overflow-x-scroll overflow-y-hidden">
      {tags.map((tag) => (
        <Tag
          key={tag.name}
          tagProps={{ type: TagType.READY, name: tag.name }}
        />
      ))}
    </div>
  );
};

const TagListSkeleton = () => {
  return (
    <div className="flex flex-row gap-1 w-full overflow-x-hidden overflow-y-auto">
      {Array.from({ length: 3 }).map((_, i) => {
        return (
          <Tag key={`skeleton-${i}`} tagProps={{ type: TagType.SKELETON }} />
        );
      })}
    </div>
  );
};

const enum TagType {
  SKELETON = "SKELETON",
  READY = "READY",
}

type TagProps =
  | { type: TagType.SKELETON }
  | { type: TagType.READY; name: string };

const Tag = ({ tagProps }: { tagProps: TagProps }) => {
  const content = (() => {
    switch (tagProps.type) {
      case TagType.SKELETON:
        return (
          <div className="w-20">
            <TextSkeleton fontSize="text-sm" />
          </div>
        );
      case TagType.READY:
        return (
          <p className="text-gray-500 text-sm whitespace-nowrap">
            {" "}
            #{tagProps.name}
          </p>
        );
    }
  })();

  return <div className="flex flex-none flex-row items-center">{content}</div>;
};

const RecipePropertiesReady = ({
  recipeDetailMeta,
}: {
  recipeDetailMeta: RecipeDetailMeta;
}) => {
  return (
    <div className="flex flex-row gap-3 w-full overflow-x-hidden overflow-y-auto">
      <RecipeProperty
        props={{
          type: RecipePropertyType.READY,
          Icon: BsPeople,
          text: `${recipeDetailMeta.servings}인분`,
        }}
      />
      <RecipeProperty
        props={{
          type: RecipePropertyType.READY,
          Icon: FaRegClock,
          text: `${recipeDetailMeta.cookTime}분`,
        }}
      />
    </div>
  );
};

const RecipePropertiesSkeleton = () => {
  return (
    <div className="flex flex-row gap-3 w-full overflow-x-hidden overflow-y-auto">
      {Array.from({ length: 2 }).map((_, i) => (
        <RecipeProperty
          key={`skeleton-${i}`}
          props={{ type: RecipePropertyType.SKELETON }}
        />
      ))}
    </div>
  );
};

const enum RecipePropertyType {
  SKELETON = "SKELETON",
  READY = "READY",
}

type RecipePropertyProps =
  | { type: RecipePropertyType.SKELETON }
  | {
      type: RecipePropertyType.READY;
      Icon: IconType;
      text: string;
    };

const RecipeProperty = ({ props }: { props: RecipePropertyProps }) => {
  const content = (() => {
    switch (props.type) {
      case RecipePropertyType.SKELETON:
        return (
          <div className="w-20">
            <TextSkeleton fontSize="text-sm" />
          </div>
        );
      case RecipePropertyType.READY:
        const Icon = props.Icon;
        return (
          <>
            <Icon size={14} />
            <p className="text-sm">{props.text}</p>
          </>
        );
    }
  })();

  return <div className="flex flex-row gap-1 items-center">{content}</div>;
};

export { RecipeDetailsCardReady, RecipeDetailsCardSkeleton };
