import { BackButton } from "@/src/shared/ui/header/header";
import { useRouter } from "next/router";
import { SearchBar } from "./SearchBar";
import { ReactNode } from "react";

interface HeaderLeftContentProps {
  initialKeyword?: string;
  onSearchExecute: () => void;
  onSearchSelect: (keyword: string) => void;
  autoFocus?: boolean;
  fallbackContent?: ReactNode;
}

export const HeaderLeftContent = ({
  initialKeyword = "",
  onSearchExecute,
  onSearchSelect,
  autoFocus = false,
  fallbackContent,
}: HeaderLeftContentProps) => {
  const router = useRouter();
  
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row gap-3 w-full h-full items-center justify-start pr-4">
        <div className="z-10">
          <BackButton onClick={() => router.back()} />
        </div>
        <SearchBar
          initialKeyword={initialKeyword}
          onSearchExecute={onSearchExecute}
          onSearchSelect={onSearchSelect}
          autoFocus={autoFocus}
          fallbackContent={fallbackContent}
        />
      </div>
    </div>
  );
};

