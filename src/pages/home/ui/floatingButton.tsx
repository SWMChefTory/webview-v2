import { Button } from "@/components/ui/button";
import { useFetchCategories } from "@/src/entities/category/model/useCategory";
import { MODE, request } from "@/src/shared/client/native/client";
import { FaPlus } from "react-icons/fa6";

export const FloatingButton = () => {
    const { data: categories } = useFetchCategories();
    return (
      <Button
        className="fixed z-[20] bottom-[20] right-[20] h-[60] border-none w-[60] bg-orange-500 rounded-full"
        variant="outline"
        aria-label="Submit"
        onClick={() => {
          request(MODE.UNBLOCKING, "RECIPE_CREATION_INPUT", JSON.stringify({categories: categories}));
        }}
      >
        <FaPlus size={32} className="text-white" />
      </Button>
    );
  };