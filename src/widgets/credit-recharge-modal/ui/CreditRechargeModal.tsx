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
  const { isOpen, step, close, isSharing } = useCreditRechargeModalStore();
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const { t } = useRechargeTranslation();

  const { handlers: dragHandlers, style: dragStyle } = useDragToClose({
    onClose: () => {
      // 공유 중이면 드래그로 닫기 방지
      if (!isSharing) {
        close();
      }
    },
    scrollAreaRef,
  });

  const handleOpenChange = (open: boolean) => {
    // 공유 중이면 닫기 방지 (오버레이 클릭, ESC 키 등)
    if (!open && isSharing) {
      return;
    }
    if (!open) {
      close();
    }
  };

  // 공유 중이면 닫을 수 없는 handleClose 함수
  const handleClose = () => {
    if (!isSharing) {
      close();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1500] animate-in fade-in duration-300" />
        <Dialog.Content
          className="fixed left-0 right-0 bottom-0 z-[2000] bg-white w-full rounded-t-3xl md:rounded-t-xl lg:rounded-2xl animate-in slide-in-from-bottom duration-300 max-h-[92svh] lg:max-h-[85vh] flex flex-col shadow-2xl md:max-w-[500px] lg:max-w-[560px] md:mx-auto md:bottom-4 lg:bottom-6"
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
            <Dialog.Description className="text-xs lg:text-sm text-gray-600">
              {t('modal.description')}
            </Dialog.Description>

            <Dialog.Close asChild>
              <button
                onClick={handleClose}
                disabled={isSharing}
                className="absolute top-2 right-6 lg:right-8 p-3 lg:p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="flex-1 overflow-y-auto overflow-x-hidden min-h-[340px]"
          >
            <div className="px-6 lg:px-8 pt-6 pb-8 h-full">
              {step === 'clipboard' && <ClipboardStep />}
              {step === 'kakao' && <KakaoShareStep />}
              {step === 'success' && <SuccessStep />}
            </div>
            {/* Safe area spacer for iOS */}
            <div className="pb-safe flex-shrink-0" aria-hidden="true" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
