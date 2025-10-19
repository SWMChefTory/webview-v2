import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { Skeleton } from "@/components/ui/skeleton";

const RecipeDetailPageReady = ({ id }: { id: string }) => {
  const { data: recipe } = useFetchRecipe(id);
  return <div>{JSON.stringify(recipe)}</div>;
};

const RecipeDetailPageSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-full h-10" />
    </div>
  );
};

export { RecipeDetailPageReady, RecipeDetailPageSkeleton };
