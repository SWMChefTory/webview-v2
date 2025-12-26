import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { useRecipeDetailTranslation } from "@/src/views/recipe-detail/hooks/useRecipeDetailTranslation";
import { TFunction } from "i18next";

type MeasurementCategory = "dry" | "liquid" | "jang";

interface ImageItem {
  src: string;
  caption: string;
}

interface MeasurementGroup {
  categoryLabel: string;
  images: ImageItem[];
}

const getMeasurementData = (t: TFunction): Record<MeasurementCategory, MeasurementGroup[]> => ({
  dry: [
    {
      categoryLabel: t("measurement.dry.tbsp.label"),
      images: [
        {
          src: "/images/measurement/dry/tbsp/measuring.png",
          caption: t("measurement.dry.tbsp.measuring"),
        },
        {
          src: "/images/measurement/dry/tbsp/spoon.png",
          caption: t("measurement.dry.tbsp.spoon"),
        },
      ],
    },
    {
      categoryLabel: t("measurement.dry.tsp.label"),
      images: [
        {
          src: "/images/measurement/dry/tsp/measuring.png",
          caption: t("measurement.dry.tsp.measuring"),
        },
        {
          src: "/images/measurement/dry/tsp/spoon.png",
          caption: t("measurement.dry.tsp.spoon")
        },
      ],
    },
  ],
  liquid: [
    {
      categoryLabel: t("measurement.liquid.tbsp.label"),
      images: [
        {
          src: "/images/measurement/liquid/tbsp/measuring.png",
          caption: t("measurement.liquid.tbsp.measuring"),
        },
        {
          src: "/images/measurement/liquid/tbsp/spoon.png",
          caption: t("measurement.liquid.tbsp.spoon"),
        },
      ],
    },
    {
      categoryLabel: t("measurement.liquid.tsp.label"),
      images: [
        {
          src: "/images/measurement/liquid/tsp/measuring.png",
          caption: t("measurement.liquid.tsp.measuring"),
        },
        {
          src: "/images/measurement/liquid/tsp/spoon.png",
          caption: t("measurement.liquid.tsp.spoon"),
        },
      ],
    },
  ],
  jang: [
    {
      categoryLabel: t("measurement.jang.tbsp.label"),
      images: [
        {
          src: "/images/measurement/jang/tbsp/measuring.png",
          caption: t("measurement.jang.tbsp.measuring"),
        },
        {
          src: "/images/measurement/jang/tbsp/spoon.png",
          caption: t("measurement.jang.tbsp.spoon"),
        },
      ],
    },
    {
      categoryLabel: t("measurement.jang.tsp.label"),
      images: [
        {
          src: "/images/measurement/jang/tsp/measuring.png",
          caption: t("measurement.jang.tsp.measuring"),
        },
        {
          src: "/images/measurement/jang/tsp/spoon.png",
          caption: t("measurement.jang.tsp.spoon")
        },
      ],
    },
  ],
});

interface MeasurementOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MeasurementOverlay = ({
  open,
  onOpenChange,
}: MeasurementOverlayProps) => {
  const [activeCategory, setActiveCategory] =
    useState<MeasurementCategory>("dry");
  const { t } = useRecipeDetailTranslation();
  const measurementData = getMeasurementData(t);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-[9998] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-200" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 z-[9999] h-[80vh] bg-white flex flex-col rounded-t-2xl shadow-2xl data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="w-10" />
            <Dialog.Title className="text-lg font-bold text-neutral-900">
              {t("measurement.title")}
            </Dialog.Title>
            <Dialog.Close className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-6 h-6 text-gray-600" />
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-safe max-w-[640px] mx-auto w-full">
            {/* Measurement Unit Table */}
            <div className="flex flex-col gap-0 mb-8 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center py-3 border-b border-gray-100 last:border-b-0">
                <span className="text-base font-normal text-neutral-900">
                  {t("measurement.units.tbsp")}
                </span>
                <span className="text-center w-10 text-gray-500">=</span>
                <span className="text-right text-[17px] font-bold text-orange-500">
                  15ml
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center py-3 border-b border-gray-100 last:border-b-0">
                <span className="text-base font-normal text-neutral-900">
                  {t("measurement.units.tsp")}
                </span>
                <span className="text-center w-10 text-gray-500">=</span>
                <span className="text-right text-[17px] font-bold text-orange-500">
                  5ml
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center py-3">
                <span className="text-base font-normal text-neutral-900">
                  {t("measurement.units.cup")}
                </span>
                <span className="text-center w-10 text-gray-500">=</span>
                <span className="text-right text-[17px] font-bold text-orange-500">
                  200ml
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="w-full flex border-b border-gray-200 mb-6">
              {(
                [
                  { key: "dry" as const },
                  { key: "liquid" as const },
                  { key: "jang" as const },
                ]
              ).map((tab) => (
                <button
                  key={tab.key}
                  className={`flex-1 flex items-center justify-center py-4 relative transition-colors ${
                    activeCategory === tab.key
                      ? "text-neutral-900 font-bold"
                      : "text-gray-400 font-medium"
                  }`}
                  onClick={() => setActiveCategory(tab.key)}
                >
                  {t(`measurement.tabs.${tab.key}`)}
                  {activeCategory === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900" />
                  )}
                </button>
              ))}
            </div>

            {/* Measurement Groups */}
            <div>
              {measurementData[activeCategory].map((group, index) => (
                <div key={index} className="mb-8">
                  <div className="text-center font-bold text-base text-neutral-900 bg-gray-100 py-2.5 px-5 rounded-full mx-auto w-fit min-w-[112px] mb-5">
                    {group.categoryLabel}
                  </div>
                  <div className="flex justify-between gap-4 flex-wrap">
                    {group.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="flex-1 min-w-[calc(50%-8px)] text-center"
                      >
                        <img
                          src={img.src}
                          alt={img.caption}
                          className="w-full aspect-square object-cover rounded-lg border border-gray-200 transition-transform hover:translate-y-[-2px] hover:shadow-md"
                        />
                        <div className="mt-2.5 text-sm font-normal text-gray-500">
                          {img.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
