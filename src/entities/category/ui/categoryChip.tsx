import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { IconType } from "react-icons";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { useResolveLongClick } from "@/src/shared/hooks/useClick";

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
    <Skeleton className={`rounded-full w-18 px-[16] py-[4]`}>
      <TextSkeleton fontSize="text-base" />
    </Skeleton>
  );
}

function FilterChip({
  fontSize,
  name,
  accessary,
  onClick,
  onClickLong,
  isSelected,
  isDarkMode = false,
}: Omit<FilterChipProps, "type"> & { fontSize: string; isDarkMode?: boolean }) {
  const { handleTapStart } = useResolveLongClick(onClick, onClickLong);

  return (
    <motion.div
      className={`rounded-lg relative ${
        isSelected && "bg-gray-200"
      } px-[12] py-[4] md:px-4 md:py-2 flex flex-row items-center whitespace-nowrap select-none gap-1`}
      whileTap={isSelected ? undefined : { scale: 0.9 }}
      transition={isSelected ? undefined : { duration: 0.2 }}
      onTapStart={handleTapStart}
    >
      <div className={`text-transparent line-clamp-1`}>{name}</div>
      <div className={`text-transparent text-xs md:text-sm flex-shrink-0`}>
        {accessary}
      </div>
      <div className="inline-flex items-center gap-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span
          className={`${
            isSelected ? "text-gray-800 font-bold" : "text-gray-600"
          } line-clamp-1`}
        >
          {name}
        </span>
        <span
          className={`${
            isSelected ? "text-gray-800 font-bold" : "text-gray-600"
          } text-xs md:text-sm flex-shrink-0`}
        >
          {accessary}
        </span>
      </div>
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

  return (
    <motion.div
      className={` px-[12] py-[4] flex flex-row items-center gap-1 whitespace-nowrap`}
      onClick={() => {
        onClick();
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <p className={`line-clamp-1 text-orange-500`}>{name}</p>
      <Icon className={`size-[16] text-orange-500 flex-shrink-0`} />
    </motion.div>
  );
}
