import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import { Skeleton } from "@/components/ui/skeleton";
import TextSkeleton from "@/src/shared/ui/skeleton/text";

const RecipeStepPageReady = ({id}: {id: string}) => {
    const { data:recipe } = useFetchRecipe(id);
    console.log(recipe);

    return (
        <div>
            {JSON.stringify(recipe)}
            여기는 레시피 스텝 페이지.
        </div>
    )
}

const RecipeStepPageSkeleton = () =>{
    return (
        <div>
            여기는 스켈레톤 페이지
            <TextSkeleton />
        </div>
    )
}

export { RecipeStepPageReady, RecipeStepPageSkeleton };