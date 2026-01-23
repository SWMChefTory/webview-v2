import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { FaRegClock } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import { IconType } from "react-icons";
import { RecipeTag } from "@/src/entities/recipe/model/useRecipe";
import {
  ThumbnailSkeleton,
  ThumbnailReady,
} from "@/src/entities/user-recipe/ui/thumbnail";
import {
  useFetchRecipeProgressWithToast,
  useUpdateCategoryOfRecipe,
} from "@/src/entities/user-recipe/model/useUserRecipe";
import { TitleReady, TitleSkeleton } from "@/src/entities/user-recipe/ui/title";
import {
  CategoryChip,
  ChipType,
} from "@/src/entities/category/ui/categoryChip";
import { RecipeStatus } from "@/src/entities/user-recipe/type/type";
import { ProgressDetailsCheckList } from "@/src/entities/user-recipe/ui/progress";
import { UserRecipe } from "@/src/entities/user-recipe/model/schema";
import { motion } from "framer-motion";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useFetchCategories } from "@/src/entities/category/model/useCategory";
import { IoMdClose } from "react-icons/io";
import { useResolveLongClick } from "@/src/shared/hooks/useClick";
import { useState } from "react";
import { IoFolderOpenOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { TimerTag } from "@/src/features/timer/ui/timerTag";
import { useUserRecipeTranslation } from "../hooks/useUserRecipeTranslation";
import { useElapsedTime } from "@/src/features/format/recipe-info/useElapsedTime";
import { useLangcode } from "@/src/shared/translation/useLangCode";
import {
  formatServing,
  formatMinute,
} from "@/src/features/format/recipe-info/formatRecipeProperties";
import { useTranslation } from "next-i18next";

const RecipeDetailsCardReady = ({
  userRecipe,
  selectedCategoryId,
}: {
  userRecipe: UserRecipe;
  selectedCategoryId: string;
}) => {
  const { recipeStatus } = useFetchRecipeProgressWithToast(userRecipe.recipeId);
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const userRouter = useRouter();
  const progress = useFetchRecipeProgressWithToast(userRecipe.recipeId);
  const { handleTapStart } = useResolveLongClick(
    () => {
      if (progress.recipeStatus === RecipeStatus.SUCCESS) {
        userRouter.push(`/recipe/${userRecipe.recipeId}/detail`);
      }
    },
    () => {
      setIsCategorySelectOpen(true);
    }
  );

  return (
    <motion.div
      whileTap={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      transition={{ duration: 1 }}
      className="relative w-full flex flex-row items-center justify-center z-10 lg:p-3 lg:rounded-xl lg:hover:bg-gray-50 lg:transition-colors"
      onTapStart={handleTapStart}
    >
      <div className="absolute flex justify-center inset-0 overflow-hidden z-100">
        <ProgressDetailsCheckList recipeStatus={recipeStatus} />
      </div>
      <div className="relative h-[108] w-[192] lg:h-[120px] lg:w-[213px] xl:h-[135px] xl:w-[240px]">
        <div className="absolute top-1 right-1 z-[10]">
          <TimerTag
            recipeId={userRecipe.recipeId}
            recipeName={userRecipe.title}
          />
        </div>
        <ThumbnailReady
          imgUrl={userRecipe.videoInfo.thumbnailUrl}
          size={{ height: 108, width: 192 }}
        />
      </div>
      <div className="w-2 lg:w-4" />
      <div className="flex flex-col items-start flex-1 gap-1 lg:gap-1.5 overflow-x-hidden">
        <TitleReady title={userRecipe.title} />
        <DetailSectionReady
          tags={userRecipe.tags || []}
          cookTime={userRecipe.recipeDetailMeta?.cookingTime ?? 0}
          servings={userRecipe.recipeDetailMeta?.servings ?? 0}
          desrciption={userRecipe.recipeDetailMeta?.description ?? ""}
        />
        <ElapsedViewTimeReady viewedAt={userRecipe.viewedAt} />
        <CategorySelect
          recipeId={userRecipe.recipeId}
          isCategorySelectOpen={isCategorySelectOpen}
          setIsCategorySelectOpen={setIsCategorySelectOpen}
          selectedCategoryId={selectedCategoryId}
        />
      </div>
    </motion.div>
  );
};

const ElapsedViewTimeReady = ({ viewedAt }: { viewedAt: Date }) => {
  const lang = useLangcode();
  const { getElapsedTime } = useElapsedTime(lang);
  return (
    <p className="text-sm line-clamp-1 text-gray-500">
      {getElapsedTime(viewedAt)}
    </p>
  );
};

const ElapsedViewTimeSkeleton = () => {
  return (
    <div className="w-20">
      <TextSkeleton fontSize="text-sm" />
    </div>
  );
};

const RecipeDetailsCardSkeleton = () => {
  return (
    <div className="w-full px-[10] flex flex-row items-center">
      <ThumbnailSkeleton size={{ height: 108, width: 192 }} />
      <div className="px-[8] flex flex-col items-start flex-1 gap-1 overflow-x-hidden">
        <TitleSkeleton />
        <CategoryChip props={{ type: ChipType.SKELETON }} />
        <DetailSectionSkeleton />
        <ElapsedViewTimeSkeleton />
      </div>
    </div>
  );
};

function DetailSectionReady({
  cookTime,
  servings,
  desrciption,
  tags,
}: {
  cookTime: number;
  servings: number;
  desrciption: string;
  tags: RecipeTag[];
}) {
  return (
    <>
      <RecipePropertiesReady
        cookTime={cookTime}
        servings={servings}
        desrciption={desrciption}
      />
      <TagListReady tags={tags ?? []} />
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
          <p className="text-gray-500 text-xs whitespace-nowrap">
            {" "}
            #{tagProps.name}
          </p>
        );
    }
  })();

  return <div className="flex flex-none flex-row items-center">{content}</div>;
};

const RecipePropertiesReady = ({
  cookTime,
  servings,
  desrciption,
}: {
  cookTime: number;
  servings: number;
  desrciption: string;
}) => {
  const { t } = useUserRecipeTranslation();
  return (
    <div className="flex flex-row gap-3 w-full overflow-x-hidden overflow-y-auto">
      <RecipeProperty
        props={{
          type: RecipePropertyType.READY,
          Icon: BsPeople,
          text: formatServing({ count: servings, t }),
        }}
      />
      <RecipeProperty
        props={{
          type: RecipePropertyType.READY,
          Icon: FaRegClock,
          text: formatMinute({ count: cookTime, t }),
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

const CategorySelect = ({
  recipeId,
  isCategorySelectOpen,
  setIsCategorySelectOpen,
  selectedCategoryId,
}: {
  recipeId: string;
  isCategorySelectOpen: boolean;
  setIsCategorySelectOpen: (isOpen: boolean) => void;
  selectedCategoryId: string;
}) => {
  const { data: categories } = useFetchCategories();
  const { updateCategory } = useUpdateCategoryOfRecipe();
  const { t } = useUserRecipeTranslation();
  const { t: tCommon } = useTranslation("common");

  return (
    <DialogPrimitive.Root
      open={isCategorySelectOpen}
      onOpenChange={setIsCategorySelectOpen}
    >
      <DialogPrimitive.Trigger></DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-gray-900/5 z-20" />
        <DialogPrimitive.Content className="inline-flex w-fit flex-col gap-2 bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 pt-4 pb-8 rounded-lg z-30 min-w-[80%] max-w-[90%]">
          <div className="flex w-full justify-end">
            <DialogPrimitive.Close asChild>
              <motion.div
                className="rounded-full p-1"
                aria-label={tCommon("accessibility.close")}
                whileTap={{ scale: 0.8, backgroundColor: "#E8E8E8" }}
              >
                <IoMdClose />
              </motion.div>
            </DialogPrimitive.Close>
          </div>

          <div className="text-sm text-gray-500 px-2 pb-2">
            {t("card.selectCategoryPlaceholder")}
          </div>
          {categories?.map((category) => (
            <>
              <DialogPrimitive.Close asChild>
                <motion.div
                  key={category.id}
                  className={`px-2 flex items-center gap-2 truncate rounded-md p-1 ${
                    category.id !== selectedCategoryId || "text-gray-500"
                  }`}
                  onClick={async () => {
                    if (category.id !== selectedCategoryId) {
                      updateCategory({
                        recipeId,
                        targetCategoryId: category.id,
                      });
                    }
                  }}
                  whileTap={
                    category.id !== selectedCategoryId
                      ? { scale: 0.95, backgroundColor: "#E8E8E8" }
                      : undefined
                  }
                >
                  <IoFolderOpenOutline size={16} />
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

export { RecipeDetailsCardReady, RecipeDetailsCardSkeleton };
