import { FaRegClock } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import { ThumbnailSkeleton, ThumbnailReady } from "./thumbnail";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { Recipe } from "@/src/entities/recipe-searched/useRecipeSearched";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { RecipeCardWrapper } from "@/src/widgets/recipe-create-dialog/recipeCardWrapper";
import { SearchResultsTranslations, SearchResultsVariant } from "./SearchResults.controller";

interface VariantStyles {
  article: string;
  titleWrapper: string;
  title: string;
  thumbnailWrapper: string;
  badge: string;
  metaWrapper: string;
  iconSize: number;
  tagWrapper: string;
  tag: string;
  description: string;
}

const variantStyles: Record<SearchResultsVariant, VariantStyles> = {
  mobile: {
    article: "w-full group cursor-pointer",
    titleWrapper: "mt-3 space-y-2.5",
    title: "text-base font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors",
    thumbnailWrapper: "relative overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-200",
    badge: "absolute top-2 left-2 bg-stone-600/50 px-2 py-1 rounded-full text-xs text-white z-10",
    metaWrapper: "flex items-center gap-3 text-sm text-gray-600",
    iconSize: 14,
    tagWrapper: "flex gap-2 line-clamp-1",
    tag: "text-xs font-semibold text-orange-600 whitespace-nowrap",
    description: "text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.75rem]",
  },
  tablet: {
    article: "w-full active:scale-[0.98] transition-transform duration-200",
    titleWrapper: "mt-4 space-y-3",
    title: "text-base font-bold text-gray-900 truncate",
    thumbnailWrapper: "relative overflow-hidden rounded-xl shadow-sm",
    badge: "absolute top-2 left-2 bg-stone-600/50 px-2.5 py-1.5 rounded-full text-xs text-white z-10",
    metaWrapper: "flex items-center gap-4 text-sm text-gray-600",
    iconSize: 14,
    tagWrapper: "flex gap-2 line-clamp-1",
    tag: "text-xs font-semibold text-orange-600 whitespace-nowrap",
    description: "text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.75rem]",
  },
  desktop: {
    article: "w-full group cursor-pointer hover:-translate-y-1 hover:shadow-xl rounded-2xl p-4 transition-all duration-300 bg-white border border-transparent hover:border-gray-100",
    titleWrapper: "space-y-3",
    title: "text-lg font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors",
    thumbnailWrapper: "relative overflow-hidden rounded-xl shadow-sm mb-4",
    badge: "absolute top-2 left-2 bg-stone-600/50 px-2.5 py-1.5 rounded-full text-xs text-white z-10",
    metaWrapper: "flex items-center gap-4 text-sm text-gray-600",
    iconSize: 16,
    tagWrapper: "flex gap-2 line-clamp-1",
    tag: "text-sm font-semibold text-orange-600 whitespace-nowrap bg-orange-50 px-2 py-0.5 rounded-full",
    description: "text-sm text-gray-600 line-clamp-2 leading-relaxed h-[3rem]",
  },
};

interface SearchedRecipeCardProps {
  recipe: Recipe;
  position: number;
  variant: SearchResultsVariant;
  translations: SearchResultsTranslations;
  onRecipeClick: (recipe: Recipe, position: number) => void;
}

export function SearchedRecipeCard({
  recipe,
  position,
  variant,
  translations,
  onRecipeClick,
}: SearchedRecipeCardProps) {
  const styles = variantStyles[variant];
  const { detailMeta, tags } = recipe;

  const thumbnailContent = (
    <div
      onClick={() => onRecipeClick(recipe, position)}
      className={styles.thumbnailWrapper}
    >
      <ThumbnailReady imgUrl={recipe.videoInfo.videoThumbnailUrl} />
      {recipe.isViewed && (
        <div className={styles.badge}>{translations.cardBadge}</div>
      )}
    </div>
  );

  if (variant === "desktop") {
    return (
      <article className={styles.article}>
        <RecipeCardWrapper
          recipeId={recipe.recipeId}
          recipeTitle={recipe.recipeTitle}
          recipeCreditCost={recipe.creditCost}
          recipeIsViewed={recipe.isViewed}
          recipeVideoType={recipe.videoInfo.videoType === "SHORTS" ? VideoType.SHORTS : VideoType.NORMAL}
          recipeVideoUrl={recipe.videoUrl}
          trigger={thumbnailContent}
          entryPoint="search_result"
        />
        <div className={styles.titleWrapper}>
          <h3 className={styles.title}>{recipe.recipeTitle}</h3>
          <div className={styles.metaWrapper}>
            <div className="flex items-center gap-1.5">
              <BsPeople size={styles.iconSize} className="shrink-0" />
              <span className="font-medium">{translations.cardServing(detailMeta.servings)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaRegClock size={styles.iconSize} className="shrink-0" />
              <span className="font-medium">{translations.cardMinute(detailMeta.cookingTime)}</span>
            </div>
          </div>
          <div className="flex gap-2 overflow-hidden">
            <div className={styles.tagWrapper}>
              {tags.slice(0, 3).map((tag, index) => (
                <span key={index} className={styles.tag}>#{tag.name}</span>
              ))}
            </div>
          </div>
          <p className={styles.description}>{detailMeta.description}</p>
        </div>
      </article>
    );
  }

  return (
    <article className={styles.article}>
      <div className={styles.titleWrapper}>
        <h3 className={styles.title}>{recipe.recipeTitle}</h3>
        <RecipeCardWrapper
          recipeId={recipe.recipeId}
          recipeTitle={recipe.recipeTitle}
          recipeCreditCost={recipe.creditCost}
          recipeIsViewed={recipe.isViewed}
          recipeVideoType={recipe.videoInfo.videoType === "SHORTS" ? VideoType.SHORTS : VideoType.NORMAL}
          recipeVideoUrl={recipe.videoUrl}
          trigger={thumbnailContent}
          entryPoint="search_result"
        />
        <div className={styles.metaWrapper}>
          <div className="flex items-center gap-1.5">
            <BsPeople size={styles.iconSize} className="shrink-0" />
            <span className="font-medium">{translations.cardServing(detailMeta.servings)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaRegClock size={styles.iconSize} className="shrink-0" />
            <span className="font-medium">{translations.cardMinute(detailMeta.cookingTime)}</span>
          </div>
        </div>
        <div className="flex gap-2 overflow-hidden">
          <div className={styles.tagWrapper}>
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={styles.tag}>#{tag.name}</span>
            ))}
          </div>
        </div>
        <p className={styles.description}>{detailMeta.description}</p>
      </div>
    </article>
  );
}

interface SkeletonStyles {
  wrapper: string;
  thumbnailWrapper: string;
  contentWrapper: string;
  titleSize: string;
  gap: string;
}

const skeletonStyles: Record<SearchResultsVariant, SkeletonStyles> = {
  mobile: {
    wrapper: "w-full",
    thumbnailWrapper: "rounded-xl overflow-hidden",
    contentWrapper: "mt-3 space-y-2.5",
    titleSize: "text-base",
    gap: "gap-3",
  },
  tablet: {
    wrapper: "w-full",
    thumbnailWrapper: "rounded-xl overflow-hidden",
    contentWrapper: "mt-4 space-y-3",
    titleSize: "text-base",
    gap: "gap-4",
  },
  desktop: {
    wrapper: "w-full p-4 rounded-2xl bg-white border border-gray-100",
    thumbnailWrapper: "rounded-xl overflow-hidden mb-4",
    contentWrapper: "space-y-3",
    titleSize: "text-lg",
    gap: "gap-4",
  },
};

interface RecipeCardSkeletonProps {
  variant: SearchResultsVariant;
}

export function RecipeCardSkeleton({ variant }: RecipeCardSkeletonProps) {
  const styles = skeletonStyles[variant];

  return (
    <div className={styles.wrapper}>
      <div className={styles.thumbnailWrapper}>
        <ThumbnailSkeleton />
      </div>
      <div className={styles.contentWrapper}>
        <TextSkeleton fontSize={styles.titleSize} />
        <div className={`flex ${styles.gap}`}>
          <TextSkeleton fontSize="text-sm" />
          <TextSkeleton fontSize="text-sm" />
        </div>
        <TextSkeleton fontSize="text-sm" />
        <TextSkeleton fontSize="text-sm" />
      </div>
    </div>
  );
}

interface EmptyStateStyles {
  wrapper: string;
  imageWrapper: string;
  textWrapper: string;
  title: string;
  subtitle: string;
}

const emptyStateStyles: Record<SearchResultsVariant, EmptyStateStyles> = {
  mobile: {
    wrapper: "flex flex-col w-full h-full items-center pt-54 px-4",
    imageWrapper: "w-44 h-44 mb-8",
    textWrapper: "text-center space-y-3",
    title: "font-bold text-xl text-gray-900",
    subtitle: "text-s text-gray-600",
  },
  tablet: {
    wrapper: "flex flex-col w-full h-full items-center justify-center pt-20 px-6",
    imageWrapper: "w-56 h-56 mb-10",
    textWrapper: "text-center space-y-4",
    title: "font-bold text-2xl text-gray-900",
    subtitle: "text-base text-gray-600",
  },
  desktop: {
    wrapper: "flex flex-col w-full h-full items-center justify-center pt-32 px-8",
    imageWrapper: "w-64 h-64 mb-12",
    textWrapper: "text-center space-y-5",
    title: "font-bold text-3xl text-gray-900",
    subtitle: "text-lg text-gray-600",
  },
};

interface EmptyStateProps {
  variant: SearchResultsVariant;
  translations: SearchResultsTranslations;
}

export function EmptyState({ variant, translations }: EmptyStateProps) {
  const styles = emptyStateStyles[variant];

  return (
    <div className={styles.wrapper}>
      <div className={styles.imageWrapper}>
        <img
          src="/empty_state.png"
          alt="empty inbox"
          className="block w-full h-full object-contain"
        />
      </div>
      <div className={styles.textWrapper}>
        <h3 className={styles.title}>{translations.emptyTitle}</h3>
        <p className={styles.subtitle}>{translations.emptySubtitle}</p>
      </div>
    </div>
  );
}
