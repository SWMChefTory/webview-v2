import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useCreditRechargeModalStore } from "../creditRechargeModalStore";
import { StepProgress } from "./StepProgress";
import { ClipboardStep } from "./ClipboardStep";
import { KakaoShareStep } from "./KakaoShareStep";
import { SuccessStep } from "./SuccessStep";
import { useDragToClose } from "@/src/shared/hooks/useDragToClose";
import { useRef } from "react";
import { useRechargeTranslation } from "../hooks/useRechargeTranslation";

export function CreditRechargeModal() {
  const { isOpen, step, close } = useCreditRechargeModalStore();
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const { t } = useRechargeTranslation();

  const { handlers: dragHandlers, style: dragStyle } = useDragToClose({
    onClose: close,
    scrollAreaRef,
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1500] animate-in fade-in duration-300" />
        <Dialog.Content
          className="fixed left-0 right-0 bottom-0 z-[2000] bg-white w-full rounded-t-3xl lg:rounded-2xl animate-in slide-in-from-bottom duration-300 max-h-[92svh] lg:max-h-[85vh] flex flex-col shadow-2xl lg:max-w-[500px] lg:mx-auto lg:bottom-6"
          onTouchStart={dragHandlers.onTouchStart}
          onTouchMove={dragHandlers.onTouchMove}
          onTouchEnd={dragHandlers.onTouchEnd}
          style={dragStyle}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-6 lg:px-8 pt-1 lg:pt-2 pb-2 lg:pb-3 border-b border-gray-100 flex-shrink-0 relative">
            <Dialog.Title className="text-xl lg:text-2xl font-bold mb-1 lg:mb-2 text-gray-900 pr-8 lg:pr-10">
              {t('modal.title')}
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                onClick={close}
                className="absolute top-2 right-6 lg:right-8 p-2 lg:p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label={t('modal.close')}
              >
                <X className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
              </button>
            </Dialog.Close>
          </div>

          {/* Step Progress */}
          <div className="px-6 lg:px-8 pt-4 flex-shrink-0">
            <StepProgress currentStep={step} />
          </div>

          {/* Step Content */}
          <div
            ref={scrollAreaRef}
            className="flex-1 overflow-y-auto overflow-x-hidden"
          >
            <div className="px-6 lg:px-8 py-6">
              {step === 'clipboard' && <ClipboardStep />}
              {step === 'kakao' && <KakaoShareStep />}
              {step === 'success' && <SuccessStep />}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
