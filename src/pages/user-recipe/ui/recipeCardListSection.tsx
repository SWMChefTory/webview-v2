import {
  CategoryChip,
  ChipType,
} from "@/src/entities/category/ui/categoryChip";
import {
  ALL_RECIPES,
  UserRecipe,
} from "@/src/entities/user_recipe/model/useUserRecipe";
import {
  Details,
  Thumbnail,
  Title,
  UserRecipeCardState,
} from "@/src/entities/user_recipe/ui/userRecipeCard";
import { IoMdAdd } from "react-icons/io";
import { IconType } from "react-icons/lib";
import { FaRegClock } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import { useFetchUserRecipes } from "@/src/entities/user_recipe/model/useUserRecipe";
import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "lucide-react";

const NO_CATEGORY_NAME = "카테고리 추가";

export const RecipeListSection = ({
  selectedCategoryId,
}: {
  selectedCategoryId: string | typeof ALL_RECIPES;
}) => {
  const { recipes, isLoading, error } = useFetchUserRecipes(selectedCategoryId);
  if (error) {
    return <div>Error</div>;
  }

  const recipeDetailCardsProps = ((): Array<{
    key: string;
    props: RecipeDetailCardProps;
  }> => {
    switch (isLoading) {
      case true:
        return Array.from({ length: 3 }).map((_, i) => {
          return {
            key: `skeleton-${i}`,
            props: { type: RecipeDetailCardType.SKELETON },
          };
        });
      case false:
        return recipes.map((recipe) => {
          return {
            key: recipe.recipeId,
            props: { type: RecipeDetailCardType.READY, userRecipe: recipe },
          };
        });
    }
  })();

  return (
    <div className="flex-1 flex flex-col w-full rounded-t-[20] bg-white border-t border-t-stone-600 overflow-y-scroll">
      <div className="flex flex-col w-full bg-white pt-6 rounded-t-[20] gap-4 ">
        {recipeDetailCardsProps.map((recipeDetailCardProps) => (
          <RecipeDetailCard
            key={recipeDetailCardProps.key}
            recipeDetailCardProps={recipeDetailCardProps.props}
          />
        ))}
      </div>
    </div>
  );
};

const enum RecipeDetailCardType {
  SKELETON = "SKELETON",
  READY = "READY",
  EMPTY = "EMPTY",
}

type RecipeDetailReadyCardProps = {
  type: RecipeDetailCardType.READY;
  userRecipe: UserRecipe;
};

type RecipeDetailSkeletonCardProps = {
  type: RecipeDetailCardType.SKELETON;
};

type RecipeDetailEmptyCardProps = {
  type: RecipeDetailCardType.EMPTY;
};

type RecipeDetailCardProps =
  | RecipeDetailSkeletonCardProps
  | RecipeDetailReadyCardProps
  | RecipeDetailEmptyCardProps;

const RecipeDetailCard = ({
  recipeDetailCardProps,
}: {
  recipeDetailCardProps: RecipeDetailCardProps;
}) => {
  switch (recipeDetailCardProps.type) {
    case RecipeDetailCardType.READY:
      return (
        <RecipeDetailReadyCard
          recipeDetailReadyCardProps={recipeDetailCardProps}
        />
      );
    case RecipeDetailCardType.SKELETON:
      return <RecipeDetailSkeletonCard />;
  }
};

const RecipeDetailReadyCard = ({
  recipeDetailReadyCardProps,
}: {
  recipeDetailReadyCardProps: RecipeDetailReadyCardProps;
}) => {
  return (
    <div className="w-full px-[10] flex flex-row items-center">
      <Thumbnail
        props={{
          type: UserRecipeCardState.READY,
          imgUrl: recipeDetailReadyCardProps.userRecipe.videoInfo.thumbnailUrl,
        }}
      />
      <div className="px-[8] flex flex-col items-start flex-1 gap-1 overflow-x-hidden">
        <Title
          props={{
            type: UserRecipeCardState.READY,
            title: recipeDetailReadyCardProps.userRecipe.title,
          }}
        />
      <CategoryChip
        props={{
          type: ChipType.EDITION,
          name:
            recipeDetailReadyCardProps.userRecipe.categoryInfo?.name ??
            NO_CATEGORY_NAME,
          accessary: IoMdAdd,
          onClick: () => {},
        }}
      />
      <RecipePropertyList
        recipeId={recipeDetailReadyCardProps.userRecipe.recipeId}
      />
      <TagList recipeId={recipeDetailReadyCardProps.userRecipe.recipeId} />
      <Details
        props={{
          type: UserRecipeCardState.READY,
          details: recipeDetailReadyCardProps.userRecipe.getSubTitle(),
        }}
      />
      </div>
    </div>
  );
};

const RecipeDetailSkeletonCard = () => {
  return (
    <div className="w-full px-[10] flex flex-row items-center">
      <Thumbnail
        props={{
          type: UserRecipeCardState.SKELETON,
        }}
      />
      <div className="px-[8] flex flex-col items-start flex-1 gap-1 overflow-x-hidden">
        <Title
          props={{
            type: UserRecipeCardState.SKELETON,
          }}
        />
      </div>
      <CategoryChip
        props={{
          type: ChipType.SKELETON,
        }}
      />
      <RecipePropertySkeletonList />
    </div>
  );
};

const TagList = ({ recipeId }: { recipeId: string }) => {
  const { data: recipe, isLoading, error } = useFetchRecipe(recipeId);

  switch (isLoading) {
    case true:
      return <TagSkeletonList />;
    case false:
      if (recipe?.tags === undefined) {
        throw new Error("Recipe tags are not found");
      }
      return (
        <div className="flex flex-row gap-1 w-full overflow-x-scroll overflow-y-hidden">
          {recipe.tags.map((tag) => (
            <Tag
              key={tag.name}
              tagProps={{ type: TagType.READY, name: tag.name }}
            />
          ))}
        </div>
      );
  }
};

const TagSkeletonList = () => {
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
        return <TextSkeleton fontSize="text-sm" />;
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


const RecipePropertyList = ({ recipeId }: { recipeId: string }) => {
  const { data: recipe, isLoading, error } = useFetchRecipe(recipeId);

  switch (isLoading) {
    case true:
      return <RecipePropertySkeletonList />;
    case false:
      if (recipe?.detailMeta === undefined) {
        throw new Error("Recipe detail meta are not found");
      }
      return (
        <div className="flex flex-row gap-3 w-full overflow-x-hidden overflow-y-auto">
          <RecipeProperty
            key={`${recipe.detailMeta.servings}-${recipe.detailMeta.cookTime}`}
            props={{
              type: RecipePropertyType.READY,
              Icon: BsPeople,
              text: `${recipe.detailMeta.servings}인분`,
            }}
          />
          <RecipeProperty
            key={`${recipe.detailMeta.cookTime}`}
            props={{
              type: RecipePropertyType.READY,
              Icon: FaRegClock,
              text: `${recipe.detailMeta.cookTime}분`,
            }}
          />
        </div>
      );
  }
};

const RecipePropertySkeletonList = () => {
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
        return <Skeleton className="w-3.5 h-3.5" />;
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
