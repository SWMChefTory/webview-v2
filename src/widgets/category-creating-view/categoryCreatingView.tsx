import * as Dialog from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import { FormInput, FormButton } from "@/src/shared/form/components";
import { useCreateCategory } from "@/src/entities/category/model/useCategory";
import { useAnimate, useMotionValue } from "motion/react";

export function CategoryCreatingView({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [hasEverTyped, setHasEverTyped] = useState(false);
  const { createCategory } = useCreateCategory();
  const [name, setName] = useState("");

  const handleNameChange = (value: string) => {
    setName(value);
    setHasEverTyped(true);
  };

  const handleSubmit = () => {
    if (isSubmittable({ name }) && !isTooLong({ name })) {
      createCategory(name);
      setHasEverTyped(false);
      setName("");
      setIsOpen(false);
    }
  };

  const isError = () => {
    const error = hasEverTyped && name.trim().length <= 0;
    return error;
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        setName("");
        setHasEverTyped(false);
        setIsOpen(open);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[1500] " />
        <Dialog.Content className="fixed left-0 right-0 bottom-0 z-[2000] bg-white w-full rounded-t-lg">
          <div className="p-5">
            <Dialog.Title className="text-xl font-bold">
              카테고리 생성
            </Dialog.Title>
          </div>

          <div className="px-4 pb-5">
            <CategoryCreatingInputForm
              name={name}
              onNameChange={handleNameChange}
              isError={isError()}
            />
          </div>

          {/* Submit Button */}
          <div className="p-3">
            <FormButton
              onSubmit={handleSubmit}
              label="완료"
              isSubmittable={isSubmittable({ name })}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const isTooLong = ({ name }: { name: string }) => {
  return name.trim().length > 20;
};

const isSubmittable = ({ name }: { name: string }) => {
  return !!name.trim();
};

function CategoryCreatingInputForm({
  name,
  onNameChange,
  isError,
}: {
  name: string;
  onNameChange: (name: string) => void;
  isError: boolean;
}) {
  const [scope, animate] = useAnimate();

  const handleNameChange = (value: string) => {
    if (isTooLong({ name: value })) {
      animate(
        scope.current,
        { opacity: [1, 1, 0] },
        { times: [0, 0.5, 1], duration: 2, ease: "easeOut" }
      );
      return;
    }
    onNameChange(value);
  };

  return (
    <div className="relative">
      <div
        ref={scope}
        style={{ opacity: 0 }}
        className="absolute right-[4] bottom-full bg-gray-500 text-white text-xs px-3 py-2 rounded-md shadow-md whitespace-nowrap"
      >
        20자 이하로 입력해주세요!
        <div
          className="absolute left-2/3 top-full w-0 h-0 
          border-l-8 border-l-transparent   
          border-r-8 border-r-transparent 
          border-t-8 border-t-gray-500"
        ></div>
      </div>
      <div className="h-[10]" />
      <FormInput
        value={name}
        onChange={handleNameChange}
        isError={isError}
        errorMessage="카테고리 이름을 채워주세요"
        placeholder="추가할 카테고리 이름을 입력해주세요"
      />
    </div>
  );
}
