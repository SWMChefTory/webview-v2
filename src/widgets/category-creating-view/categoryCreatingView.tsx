import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { FormInput, FormButton } from "@/src/shared/form/components";
import { useCreateCategory } from "@/src/entities/category/model/useCategory";

export function CategoryCreatingView({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (open: boolean) => void}) {
  const [hasEverTyped, setHasEverTyped] = useState(false);
  const { createCategory } = useCreateCategory();
  const [name, setName] = useState("");

  const isError = () => {
    const error = hasEverTyped && name.trim().length <= 0;
    return error;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setHasEverTyped(true);
  };

  const isSubmittable = () => {
    return name.trim().length > 0;
  };

  const handleSubmit = () => {
    if (isSubmittable()) {
      createCategory(name);
      setHasEverTyped(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open)=>{
        setName("");
        setHasEverTyped(false);
        setIsOpen(open);
    }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[1500] " />
        <Dialog.Content className="fixed left-0 right-0 bottom-0 z-[2000] bg-white w-full rounded-t-lg">
          <div className="p-5">
            <Dialog.Title className="text-xl font-bold">
              카테고리 생성
            </Dialog.Title>
          </div>

          <div className="px-4 pb-5">
            <FormInput
              value={name}
              onChange={handleNameChange}
              isError={isError()}
              errorMessage="카테고리 이름을 입력해주세요."
            />
          </div>

          {/* Submit Button */}
          <div className="p-3">
            <FormButton
              onSubmit={handleSubmit}
              label="완료"
              isSubmittable={isSubmittable()}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

