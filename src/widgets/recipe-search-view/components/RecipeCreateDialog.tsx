import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RecipeCreateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recipeTitle: string;
  onConfirm: () => void | Promise<void>;
}

export const RecipeCreateDialog = ({
  isOpen,
  onOpenChange,
  recipeTitle,
  onConfirm,
}: RecipeCreateDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">레시피 생성</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="text-base text-gray-600">
            <span className="text-gray-900 font-semibold">{recipeTitle}</span> 레시피를 생성하시겠어요?
          </div>
        </DialogDescription>
        <DialogFooter className="flex flex-row justify-center gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              취소
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onConfirm} className="flex-1">
              생성
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

