import TextSkeleton from "@/src/shared/ui/skeleton/text";

const TitleReady = ({ title }: { title: string }) => {
  return (
    <p className="font-semibold text-sm line-clamp-2">{title}</p>
  );
};

const TitleEmpty = () => {
  return (
    <p className="font-semibold text-sm line-clamp-2">레시피가 없어요</p>
  );
};

const TitleSkeleton = () => {
  return <TextSkeleton />;
};

export { TitleReady, TitleEmpty, TitleSkeleton };