import { Skeleton } from "@/components/ui/skeleton";

function TextSkeleton( { fontSize = "text-lg" }: { fontSize?: string } ) {
  return (
    <div className={`${fontSize} relative w-full justify-center`}>
      <div className={`${fontSize} absolute top-1/2 -translate-y-1/2 w-full leading-none`}>
        <Skeleton className="w-full">{"\u00A0"}</Skeleton>
      </div>
      {"\u00A0"}
    </div>
  );
}

export default TextSkeleton;
