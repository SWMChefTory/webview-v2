import TextSkeleton from "@/src/shared/ui/skeleton/text";

const TitleReady = ({ title }: { title: string }) => {
  return (
    <p className="text-lg font-semibold line-clamp-1">{title}</p>
  );
};

const TitleEmpty = () => {
  return (
    <p className="text-lg font-semibold line-clamp-1">레시피가 없어요</p>
  );
};

const TitleSkeleton = () => {
  return <TextSkeleton fontSize="text-lg" />;
};

export { TitleReady, TitleEmpty, TitleSkeleton };