import TextSkeleton from "@/src/shared/ui/skeleton/text";

const TitleReady = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <p
      className={`font-semibold text-sm lg:text-base xl:text-lg line-clamp-2 ${className}`}
    >
      {title}
    </p>
  );
};

const TitleEmpty = () => {
  return (
    <p className="font-semibold text-sm lg:text-base xl:text-lg line-clamp-2 text-transparent">레시피가 없어요</p>
  );
};

const TitleSkeleton = () => {
  return <TextSkeleton />;
};

export { TitleReady, TitleEmpty, TitleSkeleton };