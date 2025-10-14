import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { IconType } from "react-icons";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { useEffect, useRef, useState } from "react";

export const CategoryChip = ({
  fontSize = "text-sm",
  props,
  isDarkMode = false,
}: {
  fontSize?: string;
  props: FilterChipProps | EditableChipProps | SkeletonType;
  isDarkMode?: boolean;
}) => {
  const { type } = props;
  const specificProps = props as FilterChipProps | EditableChipProps;
  switch (type) {
    case ChipType.SKELETON:
      return <ChipSkeleton fontSize={fontSize} />;
    case ChipType.FILTER:
      const filterProps = specificProps as FilterChipProps;
      return (
        <FilterChip
          {...filterProps}
          fontSize={fontSize}
          isDarkMode={isDarkMode}
        />
      );
    case ChipType.EDITION:
      const editableProps = specificProps as EditableChipProps;
      return (
        <EditableChip
          {...editableProps}
          fontSize={fontSize}
          isDarkMode={isDarkMode}
        />
      );
  }
};

export enum ChipType {
  SKELETON = "SKELETON",
  FILTER = "FILTER",
  EDITION = "EDITION",
}

export type SkeletonType = {
  type: ChipType.SKELETON;
};

/**
 *
 * @property {IconType} accessary - 아이콘 타입
 * @property {string} name - 카테고리 이름
 * @property {() => void} onClick - 클릭 이벤트
 * @property {() => void} onClickLong - 800ms 이상 클릭시 발생하는 이벤트
 */
export type FilterChipProps = {
  type: ChipType.FILTER;
  accessary: number;
  name: string;
  onClick: () => void;
  isSelected: boolean;
  onClickLong?: () => void;
};

export type EditableChipProps = {
  type: ChipType.EDITION;
  accessary: IconType;
  name: string;
  onClick: () => void;
};

function ChipSkeleton({
  fontSize,
  className,
}: {
  fontSize: string;
  className?: string;
}) {
  return (
    <Skeleton className={`rounded-full w-32 px-[16] py-[8] ${className}`}>
      <TextSkeleton fontSize={fontSize} />
    </Skeleton>
  );
}

// cn
function FilterChip({
  fontSize,
  name,
  accessary,
  onClick,
  onClickLong,
  isSelected,
  isDarkMode = false,
}: Omit<FilterChipProps, "type"> & { fontSize: string; isDarkMode?: boolean }) {
  const calFontColor = () => {
    return isDarkMode !== isSelected ? "text-white" : "text-black";
  };
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);

  const curPoint = useRef<{ x: number; y: number } | null>(null);
  const tractPoint = useRef(({ x, y }: { x: number; y: number }) => {
    curPoint.current = { x, y };
  });

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
      window.removeEventListener("pointermove", tractPoint.current);
    };
  }, []);

  const handleTapStart = (event: PointerEvent) => {
    startPoint.current = { x: event.clientX, y: event.clientY };
    
    window.addEventListener("pointermove", tractPoint.current, { once: true });
    timer.current = setTimeout(async () => {
      if (startPoint.current === null) {
        return;
      }
      if (
        curPoint.current === null ||
        Math.abs(curPoint.current.x - startPoint.current.x) < 2 &&
        Math.abs(curPoint.current.y - startPoint.current.y) < 2
      ) {
        onClickLong?.();
      }
      window.removeEventListener("pointermove", tractPoint.current);
      curPoint.current = null;
      clearTimeout(timer.current);
      timer.current = undefined;
    }, 800);
  };

  const handleTap = () => {
    if (!timer.current) {
      return;
    }
    clearTimeout(timer.current);
    timer.current = undefined;
    onClick();
  };

  const calBackgroundColor = () => {
    if (isSelected) {
      if (isDarkMode) {
        return "bg-stone-200";
      }
      return "bg-black";
    }
    if (isDarkMode) {
      return "bg-stone-600";
    }
    return "bg-gray-100";
  };

  return (
    <motion.div
      className={`rounded-full px-[16] py-[8] flex flex-row items-center whitespace-nowrap select-none ${calFontColor()} ${calBackgroundColor()} gap-1`}
      whileTap={isSelected ? undefined : { scale: 0.9 }}
      transition={isSelected ? undefined : { duration: 0.2 }}
      onTapStart={handleTapStart}
      onTap={handleTap}
    >
      <p className={`${fontSize} line-clamp-1`}>{name}</p>
      <p className={`text-xs flex-shrink-0 ${calFontColor()}`}>{accessary}</p>
    </motion.div>
  );
}

function EditableChip({
  fontSize,
  name,
  accessary,
  onClick,
  isDarkMode = false,
}: Omit<EditableChipProps, "type"> & {
  fontSize: string;
  isDarkMode?: boolean;
}) {
  const Icon = accessary as IconType;

  const calFontColor = () => {
    return isDarkMode ? "text-white" : "text-black";
  };

  return (
    <motion.div
      className={`rounded-full px-[14] py-[6] flex flex-row items-center border border-orange-500 gap-1 whitespace-nowrap`}
      onClick={() => {
        onClick();
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <p className={`${fontSize} line-clamp-1 ${calFontColor()}`}>
        {name}
      </p>
      <Icon className={`size-[16] flex-shrink-0 ${calFontColor()}`} />
    </motion.div>
  );
}
