import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { IconType } from "react-icons";
import TextSkeleton from "@/src/shared/ui/skeleton/text";

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

export type FilterChipProps = {
  type: ChipType.FILTER;
  accessary: number;
  name: string;
  onClick: () => void;
  isSelected: boolean;
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
      <TextSkeleton fontSize={fontSize}  />
    </Skeleton>
  );
}

function FilterChip({
  fontSize,
  name,
  accessary,
  onClick,
  isSelected,
  isDarkMode = false,
}: Omit<FilterChipProps, "type"> & { fontSize: string; isDarkMode?: boolean }) {
  const calFontColor = () => {
    if (isSelected) {
      if (isDarkMode) {
        return "text-black";
      }
      return "text-white";
    }
    if (isDarkMode) {
      return "text-white";
    }
    return "text-black";
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
      className={`rounded-full px-[16] py-[8] flex flex-row items-center whitespace-nowrap  ${calFontColor() } ${calBackgroundColor()} gap-1`}
      onClick={onClick}
      whileHover={isSelected ? undefined : { scale: 1.05 }}
      whileTap={isSelected ? undefined : { scale: 0.9 }}
      transition={isSelected ? undefined : { duration: 0.2 }}
    >
      <p className={`${fontSize}  line-clamp-1`}>{name}</p>
      <p className={`text-xs flex-shrink-0  ${calFontColor()}`}>{accessary}</p>
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
      className={`rounded-full px-[14] py-[6] flex flex-row items-center border border-orange-500 max-w-[200px] line-clamp-1 gap-1 whitespace-nowrap`}
      onClick={onClick}
    >
      <p className={`${fontSize} line-clamp-1 truncate ${calFontColor()}`}>{name}</p>
      <Icon className={`size-[12] flex-shrink-0 ${calFontColor()}`} />
    </motion.div>
  );
}
