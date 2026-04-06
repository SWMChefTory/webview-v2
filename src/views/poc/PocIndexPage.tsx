import { useRouter } from "next/router";
import { ChevronLeft, ChefHat, Tag, Play } from "lucide-react";
import { RECIPE_MAP } from "./mockData";

export default function PocIndexPage() {
  const router = useRouter();
  const entries = Object.entries(RECIPE_MAP);

  return (
    <div className="relative w-full min-h-[100dvh] bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center h-12 px-4 bg-white border-b border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="ml-2 text-base font-bold text-gray-900">
          POC 레시피 선택
        </h1>
      </div>

      {/* Recipe Cards */}
      <div className="p-4 space-y-4">
        {entries.map(([id, entry]) => (
          <button
            key={id}
            type="button"
            onClick={() => router.push(`/poc/detail?recipe=${id}`)}
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left
              transition-all duration-150 hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative w-full aspect-video bg-black">
              <img
                src={`https://img.youtube.com/vi/${entry.videoId}/hqdefault.jpg`}
                alt={entry.recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="w-5 h-5 text-gray-800 ml-0.5" fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h2 className="text-base font-bold text-gray-900">
                {entry.recipe.title}
              </h2>
              {entry.recipe.description && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {entry.recipe.description}
                </p>
              )}
              <div className="mt-2.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  <ChefHat className="w-3 h-3" />
                  {entry.recipe.difficulty}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" />
                  {entry.recipe.category}
                </span>
                <span className="text-xs text-gray-400">
                  {entry.recipe.steps.length}단계
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
