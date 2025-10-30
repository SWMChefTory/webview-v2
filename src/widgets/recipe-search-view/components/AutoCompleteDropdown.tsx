import { HeaderSpacing } from "@/src/shared/ui/header";
import { AutoComplete } from "@/src/pages/search-recipe/entities/auto-complete/model/model";
import { AutoCompleteKeywordItem } from "./AutoCompleteKeywordItem";
import { ReactNode } from "react";

interface AutoCompleteDropdownProps {
  hasAutocompletes: boolean;
  autocompletes: AutoComplete[];
  keyboardInput: string;
  onSelect: (keyword: string) => void;
  fallbackContent?: ReactNode;
}

export const AutoCompleteDropdown = ({
  hasAutocompletes,
  autocompletes,
  keyboardInput,
  onSelect,
  fallbackContent,
}: AutoCompleteDropdownProps) => {
  return (
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-50">
      <HeaderSpacing />
      {!hasAutocompletes && fallbackContent && (
        <div className="absolute left-0 right-0 bottom-0 bg-black/50 top-[var(--header-height,60px)]" />
      )}
      
      <div className="flex flex-col w-full bg-white h-[calc(100vh)]">
        {!hasAutocompletes && fallbackContent ? (
          <div className="relative z-10 w-full h-full overflow-y-auto">
            {fallbackContent}
          </div>
        ) : (
          <div className="flex flex-col w-full h-full overflow-y-auto">
            {autocompletes.map((item) => (
              <AutoCompleteKeywordItem
                key={item.autocomplete}
                text={item.autocomplete}
                keyword={keyboardInput}
                onClick={() => onSelect(item.autocomplete)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

