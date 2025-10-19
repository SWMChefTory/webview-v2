import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { IoMdAdd } from "react-icons/io";

const ThumbnailBlocking = () => {
  return (
    <ThumbnailTemplate>
      <div className="flex items-center justify-center w-full h-full bg-gray-500 opacity-50">
        <Loader2 className="size-[32] animate-spin text-stone-700" />
      </div>
    </ThumbnailTemplate>
  );
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
  console.log("imgUrl", imgUrl);
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

export { ThumbnailBlocking, ThumbnailSkeleton, ThumbnailEmpty, ThumbnailReady };