import { IoMdAdd } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton";
import TextSkeleton from "@/src/shared/ui/skeleton/text";

export enum UserRecipeCardState {
  EMPTY = "EMPTY",
  SKELETON = "SKELETON",
  READY = "READY",
}

export type UserRecipeCardProps =
  | {
      type: UserRecipeCardState.SKELETON;
    }
  | {
      type: UserRecipeCardState.READY;
      imgUrl: string;
      title: string;
      details: string;
    }
  | {
      type: UserRecipeCardState.EMPTY;
    };

export const UserRecipeCard = ({ props }: { props: UserRecipeCardProps }) => {
  const childProps = (() => {
    switch (props.type) {
      case UserRecipeCardState.READY:
        return {
          thumbnailProps: {
            type: UserRecipeCardState.READY,
            imgUrl: props.imgUrl,
          },
          titleProps: { type: UserRecipeCardState.READY, title: props.title },
          detailsProps: {
            type: UserRecipeCardState.READY,
            details: props.details,
          },
        };
      case UserRecipeCardState.SKELETON:
        return {
          thumbnailProps: { type: UserRecipeCardState.SKELETON },
          titleProps: { type: UserRecipeCardState.SKELETON },
          detailsProps: { type: UserRecipeCardState.SKELETON },
        };
      case UserRecipeCardState.EMPTY:
        return {
          thumbnailProps: { type: UserRecipeCardState.EMPTY },
          titleProps: { type: UserRecipeCardState.EMPTY },
          detailsProps: { type: UserRecipeCardState.EMPTY },
        };
    }
  })();

  return (
    <div className="w-[156]">
      <Thumbnail props={childProps.thumbnailProps} />
      <div className="w-full">
        <Title props={childProps.titleProps} />
        <Details props={childProps.detailsProps} />
      </div>
    </div>
  );
};

import { useFetchRecipeProgress, UserRecipe } from "@/src/entities/user_recipe/model/useUserRecipe";
import { Loader2 } from "lucide-react";
export const UserRecipeCardReady = ({
  userRecipe
}: {
  userRecipe: UserRecipe;
}) => {
  const progress = useFetchRecipeProgress(userRecipe.recipeId);
  return (
    <div className="w-[156]">
      <Thumbnail props={{ type: UserRecipeCardState.READY, imgUrl: userRecipe.videoInfo.thumbnailUrl }} />
      <div className="w-full">
        <Title props={{ type: UserRecipeCardState.READY, title: userRecipe.title }} />
        <Details props={{ type: UserRecipeCardState.READY, details: userRecipe.getSubTitle() }} />
      </div>
    </div>
  );
};

export const UserRecipeCardEmpty = () => {
  return (
    <div className="w-[156]">
      <Thumbnail props={{ type: UserRecipeCardState.EMPTY }} />
      <div className="w-full">
        <Title props={{ type: UserRecipeCardState.EMPTY }} />
        <Details props={{ type: UserRecipeCardState.EMPTY }} />
      </div>
    </div>
  );
};

export const UserRecipeCardSkeleton = () => {
  return (
    <div className="w-[156]">
      <Thumbnail props={{ type: UserRecipeCardState.SKELETON}} />
      <div className="w-full">
        <Title props={{ type: UserRecipeCardState.SKELETON }} />
        <Details props={{ type: UserRecipeCardState.SKELETON }} />
      </div>
    </div>
  );
};




export type ThumbnailProps =
  | {
      type: UserRecipeCardState.SKELETON;
    }
  | {
      type: UserRecipeCardState.READY;
      imgUrl?: string;
    }
  | {
      type: UserRecipeCardState.EMPTY;
    };

export const Thumbnail = ({ props }: { props: ThumbnailProps }) => {
  switch (props.type) {
    case UserRecipeCardState.READY:
      return (
        <ThumbnailTemplate>
          <img
            src={props.imgUrl}
            className="block w-full h-full object-cover object-center"
          />
        </ThumbnailTemplate>
      );
    case UserRecipeCardState.EMPTY:
      return (
        <ThumbnailTemplate>
          <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
            <IoMdAdd className="size-[32]" />
          </div>
        </ThumbnailTemplate>
      );
    case UserRecipeCardState.SKELETON:
      return (
        <ThumbnailTemplate>
          <Skeleton className="w-full h-full bg-gray-200" />
        </ThumbnailTemplate>
      );
  }
};

const ThumbnailInCreatingProgress = ({recipeId}: {recipeId: string}) => {
  const progress = useFetchRecipeProgress(recipeId);
  return (
    <ThumbnailTemplate>
      <div className="flex items-center justify-center w-full h-full bg-gray-500 opacity-50">
        <Loader2 className="size-[32]" />
      </div>
    </ThumbnailTemplate>
  );
}

const ThumbnailBlocking = ({ imgUrl }: { imgUrl: string }) => {
  return (
    <ThumbnailTemplate>
      <div className="flex items-center justify-center w-full h-full bg-gray-500 opacity-50">
        <Loader2 className="size-[32]" />
      </div>
    </ThumbnailTemplate>
  )
};

const ThumbnailSkeleton = () => {
  return (
    <ThumbnailTemplate>
      <Skeleton className="w-full h-full bg-gray-200" />
    </ThumbnailTemplate>
  );
};

const ThumbnailEmpty = () => {
  return (
    <ThumbnailTemplate>
      <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
        <IoMdAdd className="size-[32]" />
      </div>
    </ThumbnailTemplate>
  );
};

const ThumbnailReady = ({ imgUrl }: { imgUrl: string }) => {
  return (
    <ThumbnailTemplate>
      <img
        src={imgUrl}
        className="block w-full h-full object-cover object-center"
      />
    </ThumbnailTemplate>
  );
};

const ThumbnailTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-[156] h-[156] overflow-hidden rounded-md">{children}</div>
  );
};

type TitleProps =
  | {
      type: UserRecipeCardState.SKELETON;
    }
  | {
      type: UserRecipeCardState.READY;
      title?: string;
    }
  | {
      type: UserRecipeCardState.EMPTY;
    };

export const Title = ({ props }: { props: TitleProps }) => {
  switch (props.type) {
    case UserRecipeCardState.READY:
      return (
        <p className="text-lg font-semibold line-clamp-1">{props.title}</p>
      );
    case UserRecipeCardState.EMPTY:
      return (
        <p className="text-lg font-semibold line-clamp-1">레시피가 없어요</p>
      );
    case UserRecipeCardState.SKELETON:
      return <TextSkeleton fontSize="text-lg" />;
  }
};

export type DetailsProps =
  | {
      type: UserRecipeCardState.SKELETON;
    }
  | {
      type: UserRecipeCardState.READY;
      details?: string;
    }
  | {
      type: UserRecipeCardState.EMPTY;
    };

export const Details = ({ props }: { props: DetailsProps }) => {
  switch (props.type) {
    case UserRecipeCardState.READY:
      return (
        <p className="text-sm line-clamp-1 text-gray-500">{props.details}</p>
      );
    case UserRecipeCardState.EMPTY:
      return (
        <p className="text-sm line-clamp-1 text-gray-500">
          레시피를 만들어주세요
        </p>
      );
    case UserRecipeCardState.SKELETON:
      return <TextSkeleton fontSize="text-sm" />;
  }
};

