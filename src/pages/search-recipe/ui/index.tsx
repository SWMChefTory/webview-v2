import { RecentSearchSection } from "./recentSearchSection";
import { PopularSearchSection } from "./popularSearchSection";
import { TrendRecipeSection } from "./trendRecipeSection";

export const SearchRecipeContent = ({
  onSearchSelect,
}: {
  onSearchSelect?: (keyword: string) => void;
}) => {
  return (
    <div className="flex flex-col w-full h-full bg-white">
      <div className="px-4 py-4 space-y-6">
        <RecentSearchSection onSearchSelect={onSearchSelect} />

        <hr className="border-gray-100" />

        <PopularSearchSection onSearchSelect={onSearchSelect} />

        <hr className="border-gray-100" />

        <TrendRecipeSection />
      </div>
    </div>
  );
};
