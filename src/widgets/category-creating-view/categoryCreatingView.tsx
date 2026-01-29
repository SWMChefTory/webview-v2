import * as Dialog from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import { FormInput, FormButton } from "@/src/shared/form/components";
import { useCreateCategory } from "@/src/entities/category/model/useCategory";
import { useAnimate, useMotionValue } from "motion/react";
import { useCategoryCreatingTranslation } from "@/src/views/user-recipe/hooks/useCategoryCreatingTranslation";

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
  const { t } = useCategoryCreatingTranslation();

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
        <Dialog.Content className="fixed left-0 right-0 bottom-0 z-[2000] bg-white w-full rounded-t-lg md:max-w-[500px] md:mx-auto md:bottom-4 md:rounded-lg lg:max-w-[560px] xl:max-w-[640px] lg:bottom-6 lg:rounded-xl">
          <div className="p-5 lg:p-6">
            <Dialog.Title className="text-xl lg:text-2xl font-bold">
              {t("form.title")}
            </Dialog.Title>
          </div>

          <div className="px-4 pb-5 lg:px-6 lg:pb-6">
            <CategoryCreatingInputForm
              name={name}
              onNameChange={handleNameChange}
              isError={isError()}
            />
          </div>

          {/* Submit Button */}
          <div className="p-3 lg:p-4">
            <FormButton
              onSubmit={handleSubmit}
              label={t("form.submit")}
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
  const { t } = useCategoryCreatingTranslation();

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
        className="absolute right-[4] bottom-full bg-gray-500 text-white text-xs lg:text-sm px-3 py-2 lg:px-4 lg:py-2.5 rounded-md shadow-md whitespace-nowrap"
      >
        {t("form.errorTooLong")}
        <div
          className="absolute left-2/3 top-full w-0 h-0
          border-l-8 border-l-transparent
          border-r-8 border-r-transparent
          border-t-8 border-t-gray-500"
        />
      </div>
      <div className="h-[10]" />
      <FormInput
        value={name}
        onChange={handleNameChange}
        isError={isError}
        errorMessage={t("form.errorEmpty")}
        placeholder={t("form.placeholder")}
      />
    </div>
  );
}