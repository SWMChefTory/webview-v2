import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useRecipeCreatingViewOpenStore } from "./recipeCreatingViewOpenStore";
import { MODE, request } from "@/src/shared/client/native/client";
import { UNBLOCKING_HANDLER_TYPE } from "@/src/shared/client/native/unblockingHandlerType";
import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useTranslation } from "next-i18next";

export function ShareTutorialModal() {
  const { isTutorialOpen, closeTutorial, openRecipeCreatingView, videoUrl, markTutorialAsSeen } =
    useRecipeCreatingViewOpenStore();

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const { t } = useTranslation("common");

  const { guideVideoSrc, deviceType, deviceStyles } = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        guideVideoSrc: "",
        deviceType: "android" as const,
        deviceStyles: {
          container: "px-2.5 py-4",
          frame: "rounded-xl bg-gray-900 border-[2px] border-gray-700",
          screen: "rounded-lg",
          reflection: "rounded-t-xl",
        },
      };
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);

    if (isIOS) {
      return {
        guideVideoSrc: "/guide-ios.mp4",
        deviceType: "ios" as const,
        deviceStyles: {
          container: "px-3 py-4",
          frame: "rounded-[2.5rem] bg-black border-[3px] border-gray-800",
          screen: "rounded-[2rem]",
          reflection: "rounded-t-[2.5rem]",
        },
      };
    }

    return {
      guideVideoSrc: "/guide-android.webm",
      deviceType: "android" as const,
      deviceStyles: {
        container: "px-2.5 py-4",
        frame: "rounded-xl bg-gray-900 border-[2px] border-gray-700",
        screen: "rounded-lg",
        reflection: "rounded-t-xl",
      },
    };
  }, []);

  // tutorial_share_view 이벤트: 모달이 열릴 때 트래킹
  useEffect(() => {
    if (isTutorialOpen) {
      track(AMPLITUDE_EVENT.TUTORIAL_SHARE_VIEW);
    }
  }, [isTutorialOpen]);

  const handleClose = () => {
    closeTutorial();
  };

  const handleOpenYouTube = () => {
    track(AMPLITUDE_EVENT.TUTORIAL_SHARE_YOUTUBE_CLICK);
    request(MODE.UNBLOCKING, UNBLOCKING_HANDLER_TYPE.OPEN_YOUTUBE);
    handleClose();
  };

  const handleDirectInput = () => {
    track(AMPLITUDE_EVENT.TUTORIAL_SHARE_DIRECT_CLICK);
    handleClose();
    setTimeout(() => {
      openRecipeCreatingView(videoUrl);
    }, 300);
  };

  const handleDontShowAgain = () => {
    track(AMPLITUDE_EVENT.TUTORIAL_SHARE_DISMISS);
    markTutorialAsSeen();
    handleClose();
    setTimeout(() => {
      openRecipeCreatingView(videoUrl);
    }, 300);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!isTutorialOpen) return;
    
    startYRef.current = e.touches[0].clientY;
    
    const scrollTop = scrollAreaRef.current?.scrollTop ?? 0;
    
    if (scrollTop <= 0) {
      setIsDragging(true);
    }
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startYRef.current;
    const scrollTop = scrollAreaRef.current?.scrollTop ?? 0;

    if (deltaY > 0 && scrollTop <= 0) {
      setDragOffset(deltaY);
      e.preventDefault();
    } else if (scrollTop > 0) {
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (!isDragging) return;
    
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800;
    const threshold = Math.min(240, viewportHeight * 0.25);
    const shouldClose = dragOffset > threshold;
    
    setIsDragging(false);
    setDragOffset(0);
    
    if (shouldClose) {
      handleClose();
    }
  };

  return (
    <Dialog.Root open={isTutorialOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1500] animate-in fade-in duration-300" />
        <Dialog.Content
          className="fixed left-0 right-0 bottom-0 z-[2000] bg-white w-full rounded-t-3xl lg:rounded-2xl animate-in slide-in-from-bottom duration-300 max-h-[92svh] lg:max-h-[85vh] flex flex-col shadow-2xl lg:max-w-[500px] xl:max-w-[560px] lg:mx-auto lg:bottom-6 xl:bottom-8"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ transform: `translateY(${dragOffset}px)`, transition: isDragging ? "none" : "transform 200ms ease" }}
        >
          <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          <div className="px-6 lg:px-8 pt-1 lg:pt-2 pb-2 lg:pb-3 border-b border-gray-100 flex-shrink-0 relative">
            <Dialog.Title className="text-xl lg:text-2xl font-bold mb-1 lg:mb-2 text-gray-900 pr-8 lg:pr-10">
              {t("recipeCreating.tutorial.title")}
            </Dialog.Title>
            <Dialog.Description className="text-xs lg:text-sm text-gray-600">
              {t("recipeCreating.tutorial.description")}
            </Dialog.Description>
            
            <Dialog.Close asChild>
              <button
                onClick={handleClose}
                className="absolute top-2 right-6 lg:right-8 p-2 lg:p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label={t("recipeCreating.accessibility.close")}
              >
                <X className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
              </button>
            </Dialog.Close>
          </div>

          <div 
            ref={scrollAreaRef} 
            className="flex-1 overflow-y-auto overflow-x-hidden"
          >
            <div className="px-6 lg:px-8 py-3 lg:py-4 space-y-3 lg:space-y-4">
              {guideVideoSrc && (
                <div className="flex justify-center">
                  <div className={`relative w-full max-w-[240px] md:max-w-[320px] lg:max-w-[360px] xl:max-w-[400px] ${deviceStyles.container}`}>
                    <div className={`relative p-1 shadow-2xl ${deviceStyles.frame}`}>
                      {deviceType === "android" && (
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full z-10" />
                      )}

                      <div className={`relative overflow-hidden bg-black aspect-[9/19.5] ${deviceStyles.screen}`}>
                        <video
                          src={guideVideoSrc}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-contain"
                        >
                          {t("recipeCreating.tutorial.videoFallback")}
                        </video>
                      </div>

                      {deviceType === "ios" && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
                      )}
                    </div>

                    <div className="absolute inset-0 pointer-events-none opacity-10">
                      <div className={`absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white to-transparent ${deviceStyles.reflection}`} />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-center space-y-2 lg:space-y-3">
                {/* 줄바꿈 처리를 위해 whitespace-pre-line 추가 */}
                <p className="text-sm lg:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {t("recipeCreating.tutorial.instruction")}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 lg:px-8 pt-3 lg:pt-4 pb-4 lg:pb-5 pb-safe border-t border-gray-100 bg-white flex-shrink-0 space-y-2 lg:space-y-3">
            <Button
              onClick={handleOpenYouTube}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 lg:py-4 lg:text-base rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] lg:hover:-translate-y-0.5 transition-all duration-200"
            >
              {t("recipeCreating.tutorial.goCreate")}
            </Button>
            <Button
              onClick={handleDirectInput}
              variant="outline"
              className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 lg:py-4 lg:text-base rounded-xl hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] lg:hover:-translate-y-0.5 transition-all duration-200"
            >
              {t("recipeCreating.tutorial.directInput")}
            </Button>

            <button
              onClick={handleDontShowAgain}
              className="w-full text-xs lg:text-sm text-gray-400 text-center py-1 lg:py-2 hover:text-gray-600 active:text-gray-700 transition-colors font-medium"
            >
              {t("recipeCreating.tutorial.dontShowAgain")}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}