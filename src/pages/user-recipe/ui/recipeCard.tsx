import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import { RecipeDetailMeta } from "@/src/entities/recipe/model/useRecipe";
import { FaRegClock } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import { IconType } from "react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { RecipeTag } from "@/src/entities/recipe/model/useRecipe";
import {
  ThumbnailSkeleton,
  ThumbnailReady,
} from "@/src/entities/user_recipe/ui/thumbnail";
import { UserRecipe } from "@/src/entities/user_recipe/model/useUserRecipe";
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
const NO_CATEGORY_NAME = "카테고리 추가";

const RecipeDetailsCardReady = ({ userRecipe }: { userRecipe: UserRecipe }) => {
  return (
    <div className="w-full px-[10] flex flex-row items-center">
      <ThumbnailReady imgUrl={userRecipe.videoInfo.thumbnailUrl} />
      <div className="px-[8] flex flex-col items-start flex-1 gap-1 overflow-x-hidden">
        <TitleReady title={userRecipe.title} />
        <CategoryChip
          props={{
            type: ChipType.EDITION,
            name: userRecipe.categoryInfo?.name ?? NO_CATEGORY_NAME,
            accessary: IoMdAdd,
            onClick: () => {},
          }}
        />
        <DetailSectionReady recipeId={userRecipe.recipeId} />
        <ElapsedViewTimeReady details={userRecipe.getSubTitle()} />
      </div>
    </div>
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
      <p className="text-gray-500 text-sm whitespace-nowrap"> {content}</p>
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
        return <div className="w-20"><TextSkeleton fontSize="text-sm" /></div>;
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
