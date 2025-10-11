import TextSkeleton from "@/src/shared/ui/skeleton/text";

const ElapsedViewTimeEmpty = () => {
  return (
    <p className="text-sm line-clamp-1 text-gray-500">레시피를 만들어주세요</p>
  );
};

const ElapsedViewTimeSkeleton = () => {
  return (
    <div className="w-20">
      <TextSkeleton fontSize="text-sm" />
    </div>
  );
};

const ElapsedViewTimeReady = ({ details }: { details: string }) => {
  return <p className="text-sm line-clamp-1 text-gray-500">{details}</p>;
};

export { ElapsedViewTimeEmpty, ElapsedViewTimeSkeleton, ElapsedViewTimeReady };
