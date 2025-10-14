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
  useFetchRecipeProgressNotSuspense,
  UserRecipe,
} from "@/src/entities/user_recipe/model/useUserRecipe";
import { TitleReady, TitleSkeleton } from "@/src/entities/user_recipe/ui/title";
import {
  CategoryChip,
  ChipType,
} from "@/src/entities/category/ui/categoryChip";
import { IoMdAdd } from "react-icons/io";
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
import { DialogOverlay } from "@/components/ui/dialog";


const NO_CATEGORY_NAME = "카테고리 선택";

const RecipeDetailsCardReady = ({ userRecipe }: { userRecipe: UserRecipe }) => {
  const { progress, isLoading } = useFetchRecipeProgressNotSuspense(
    userRecipe.recipeId
  );
  return (
    <div className="relative w-full px-[10] flex flex-row items-center justify-center z-10">
      {progress && (
        progress.recipeStatus === RecipeStatus.IN_PROGRESS && (
          <div className="absolute flex justify-center inset-0 overflow-hidden z-100">
            <ProgressDetailsCheckList
              recipeProgressDetails={progress?.recipeProgressDetails ?? []}
            />
          </div>
        )
      )}
      <ThumbnailReady imgUrl={userRecipe.videoInfo.thumbnailUrl} />
      <div className="px-[8] flex flex-col items-start flex-1 gap-1 overflow-x-hidden">
        <TitleReady title={userRecipe.title} />
        <CategoryChip
          props={{
            type: ChipType.EDITION,
            name: userRecipe.categoryInfo?.name ?? NO_CATEGORY_NAME,
            accessary: userRecipe.categoryInfo?CgArrowsExchangeV:IoMdAdd,
            onClick: () => {},
          }}
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
      {/* <CategorySelectCombobox userRecipe={userRecipe} /> */}
    </div>
  );
};

const CategorySelectCombobox = ({ userRecipe }: { userRecipe: UserRecipe }) => {
  const { data: categories } = useFetchCategories();
  return (
    <DialogPrimitive.Root open={true}>
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 bg-gray-900/5 z-20" />
            <DialogPrimitive.Content className="bg-white z-index-100 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-6 rounded-lg w-[80%] z-30">
                <div className="flex flex-col gap-2">
                    {categories?.map((category) => (
                        <div key={category.id} className="flex flex-row gap-2">
                            <CategoryChip
                                props={{ type: ChipType.EDITION, name: category.name,  onClick: () => {} }}
                            />
                        </div>
                    ))}
                </div>
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

  return (
    <div className="flex flex-none flex-row items-center">
      {content}
    </div>
  );
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
