import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecipeCreatingViewOpenStore } from "@/src/widgets/recipe-creating-view/recipeCreatingViewOpenStore";

export const FloatingButton = () => {
  const {open} = useRecipeCreatingViewOpenStore();
  return (
    <div className="fixed z-[100] bottom-[20] right-[20] pb-safe">
      <Button
        id="element-of-mystery"
        className="h-[60] border-none w-[60] bg-orange-500 rounded-full"
        variant="outline"
        aria-label="Submit"
        onClick={()=>{
          open("");
        }}
      >
        <FaPlus size={40} className="text-white" />
      </Button>
    </div>
  );
};

export function FloatingButtonSkeleton() {
  return (
    <div className="fixed z-[100] bottom-[20] right-[20] pb-safe">
      <Skeleton className="h-[60] w-[60] rounded-full" />
    </div>
  );
}