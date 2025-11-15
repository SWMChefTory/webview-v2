import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FaPlus } from "react-icons/fa6";

const ThumbnailBlocking = ({
  size,
}: {
  size: { width: number; height: number };
}) => {
  return (
    <ThumbnailTemplate size={size}>
      <div className="flex items-center justify-center w-full h-full bg-gray-500 opacity-50">
        <Loader2 className="size-[32] animate-spin text-stone-700" />
      </div>
    </ThumbnailTemplate>
  );
};

const ThumbnailSkeleton = ({
  size,
}: {
  size: { width: number; height: number };
}) => {
  return (
    <ThumbnailTemplate size={size}>
      <Skeleton className="w-full h-full bg-gray-200" />
    </ThumbnailTemplate>
  );
};

const ThumbnailEmpty = ({
  size,
}: {
  size: { width: number; height: number };
}) => {
  return (
    <div className="flex flex-row">
      <ThumbnailTemplate size={size}>
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <FaPlus />
        </div>
      </ThumbnailTemplate>
    </div>
  );
};

const ThumbnailReady = ({
  imgUrl,
  size,
}: {
  imgUrl: string;
  size: { width: number; height: number };
}) => {
  return (
    <ThumbnailTemplate size={size}>
      <img
        src={imgUrl}
        className={`block w-full h-full object-cover object-center`}
        onDragStart={(e) => e.preventDefault()}
      />
    </ThumbnailTemplate>
  );
};

const ThumbnailTemplate = ({
  children,
  size,
}: {
  children: React.ReactNode;
  size: { width: number; height: number };
}) => {
  return (
    <div
      className={`overflow-hidden rounded-md relative`}
      style={{ width: size.width, height: size.height }}
    >
      {children}
    </div>
  );
};
//9:16

export { ThumbnailBlocking, ThumbnailSkeleton, ThumbnailEmpty, ThumbnailReady };
