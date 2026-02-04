import {
  ThumbnailSkeleton,
  ThumbnailReady,
} from "../../search-results/ui/thumbnail";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { FaRegClock } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import { useCategoryResultsTranslation } from "@/src/views/category-results/hooks/useCategoryResultsTranslation";

export type RecipeCardProps = {
  recipeTitle: string;
  videoThumbnailUrl?: string;
  isViewed: boolean;
  servings: number;
  cookingTime: number;
  tags: { name: string }[];
  description: string;
  isTablet?: boolean;
};

export const RecipeCardReady = ({
  recipeTitle,
  videoThumbnailUrl,
  isViewed,
  servings,
  cookingTime,
  tags,
  description,
  isTablet = false,
}: RecipeCardProps) => {
  const { t } = useCategoryResultsTranslation();

  return (
    <article className={`w-full group cursor-pointer ${isTablet ? "hover:scale-[1.02] transition-transform duration-200" : ""}`}>
      <div className={`relative overflow-hidden rounded-xl shadow-sm transition-shadow duration-200 ${isTablet ? "group-hover:shadow-lg" : "group-hover:shadow-md"}`}>
        <ThumbnailReady imgUrl={videoThumbnailUrl || ""} />
        {isViewed && (
          <div className="absolute top-2 left-2 bg-stone-600/50 px-2 py-1 rounded-full text-xs text-white z-10">
            {t("card.badge")}
          </div>
        )}
      </div>

      <div className={isTablet ? "mt-4 space-y-3" : "mt-3 space-y-2.5"}>
        <h3 className={`font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors ${isTablet ? "text-lg" : "text-base"}`}>
          {recipeTitle}
        </h3>

        <div className={`flex items-center text-gray-600 ${isTablet ? "gap-4 text-base" : "gap-3 text-sm"}`}>
          <div className="flex items-center gap-1.5">
            <BsPeople size={isTablet ? 16 : 14} className="shrink-0" />
            <span className="font-medium">
              {t("card.serving", { count: servings })}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <FaRegClock size={isTablet ? 16 : 14} className="shrink-0" />
            <span className="font-medium">
              {t("card.minute", { count: cookingTime })}
            </span>
          </div>
        </div>

        {!!tags?.length && (
          <div className="flex gap-2 overflow-hidden">
            <div className="flex gap-2 line-clamp-1">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className={`font-semibold text-orange-600 whitespace-nowrap ${isTablet ? "text-sm" : "text-xs"}`}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className={`text-gray-600 line-clamp-2 leading-relaxed ${isTablet ? "text-base min-h-[3rem]" : "text-sm min-h-[2.75rem]"}`}>
          {description}
        </p>
      </div>
    </article>
  );
};

export const RecipeCardSkeleton = ({ isTablet = false }: { isTablet?: boolean }) => {
  return (
    <div className="w-full">
      <div className="rounded-xl overflow-hidden">
        <ThumbnailSkeleton />
      </div>
      <div className={`${isTablet ? "mt-4 space-y-3" : "mt-3 space-y-2.5"}`}>
        <TextSkeleton fontSize="text-base" />
        <div className={`flex ${isTablet ? "gap-4" : "gap-3"}`}>
          <TextSkeleton fontSize="text-sm" />
          <TextSkeleton fontSize="text-sm" />
        </div>
        <TextSkeleton fontSize="text-sm" />
        <TextSkeleton fontSize="text-sm" />
      </div>
    </div>
  );
};

export const EmptyState = ({ t }: { t: (key: string) => string }) => {
  return (
    <div className="flex flex-col w-full h-full items-center pt-50 px-4">
      <div className="w-40 h-40 mb-8">
        <img
          src={"/empty_state.png"}
          alt="empty inbox"
          className="block w-full h-full object-contain"
        />
      </div>
      <div className="text-center space-y-3">
        <h3 className="font-bold text-xl text-gray-900">
          {t("empty.title")}
        </h3>
        <p className="text-s text-gray-600">{t("empty.subtitle")}</p>
      </div>
    </div>
  );
};
