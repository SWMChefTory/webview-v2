import { useRouter } from "next/router";
import { useCallback, useMemo, useRef } from "react";
import { ChevronLeft, Clock, ChefHat, Tag } from "lucide-react";
import { getRecipeEntry } from "./mockData";
import { IngredientsSection } from "./components/IngredientsSection";
import { StepsSection } from "./components/StepsSection";
import dynamic from "next/dynamic";
const ReactYouTube = dynamic(() => import("react-youtube"), { ssr: false });

export default function PocDetailPage() {
  const router = useRouter();
  const recipeId = router.query.recipe as string | undefined;
  const { recipe, videoId } = getRecipeEntry(recipeId);
  const ytRef = useRef<YT.Player | null>(null);

  const opts = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 0,
        rel: 0,
        controls: 1,
        modestbranding: 1,
        playsinline: 1,
      },
    }),
    [],
  );

  const handleSeekTo = useCallback((seconds: number) => {
    ytRef.current?.seekTo(seconds, true);
    ytRef.current?.playVideo();
  }, []);

  return (
    <div className="relative w-full h-[100dvh] overflow-y-auto overscroll-y-none bg-white [-webkit-overflow-scrolling:touch]">
      {/* YouTube iframe — sticky: 스크롤해도 상단 고정 */}
      <div className="sticky top-0 z-20 w-full aspect-video bg-black">
        <div className="relative w-full aspect-video shrink-0">
          <ReactYouTube
            key={0}
            videoId={videoId}
            opts={opts}
            onReady={(e) => {
              ytRef.current = e.target;
            }}
            iframeClassName="absolute inset-0 z-0"
          />
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute top-3 left-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white
            transition-all duration-150 hover:bg-black/60 active:scale-[0.90] cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Recipe Summary */}
      <div className="pt-4 px-4">
        <h1 className="text-xl font-bold text-gray-900">{recipe.title}</h1>
        {recipe.description && (
          <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
            {recipe.description}
          </p>
        )}

        {/* Meta info */}
        <div className="mt-3 flex items-center gap-3">
          {recipe.cookingTimeMinutes && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              {recipe.cookingTimeMinutes}분
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
            <ChefHat className="w-3.5 h-3.5" />
            {recipe.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
            <Tag className="w-3.5 h-3.5" />
            {recipe.category}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 mx-4 h-[1px] bg-gray-200" />

      {/* Ingredients */}
      <IngredientsSection ingredients={recipe.ingredients} />

      {/* Divider */}
      <div className="my-4 mx-4 h-[1px] bg-gray-200" />

      {/* Steps — step 클릭 시 영상 해당 시간으로 이동 */}
      <StepsSection steps={recipe.steps} onSeekTo={handleSeekTo} />

      {/* Serving Tip */}
      {recipe.servingTip && (
        <>
          <div className="my-4 mx-4 h-[1px] bg-gray-200" />
          <div className="px-4 pb-4">
            <h2 className="text-lg font-bold text-gray-900">서빙 팁</h2>
            <div className="h-2" />
            <div className="bg-orange-50 rounded-xl px-4 py-3">
              <p className="text-sm text-orange-800 leading-relaxed">
                {recipe.servingTip}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Start Cooking CTA */}
      <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-4 z-10">
        <button
          type="button"
          onClick={() => {
            if ((window as any).ReactNativeWebView) {
              const msg = {
                intended: true,
                action: "REQUEST",
                mode: "UNBLOCKING",
                type: "START_COOKING",
                payload: {
                  recipeId: recipeId ?? "aglio-olio",
                },
              };
              console.log("__NATIVE_MSG__" + JSON.stringify(msg));
            } else {
              // 웹 브라우저 fallback: 기존 웹뷰 step 페이지로 이동
              router.push(`/poc/step?recipe=${recipeId ?? "aglio-olio"}&step=1&scene=0`);
            }
          }}
          className="flex h-12 gap-2 px-5 items-center justify-center bg-orange-500 rounded-full shadow-lg shadow-orange-200/40 text-white font-bold text-base
            transition-all duration-150 hover:bg-orange-600 hover:shadow-xl active:scale-[0.95] cursor-pointer"
        >
          <ChefHat className="w-5 h-5" />
          요리 시작
        </button>
      </div>

      {/* Bottom spacing */}
      <div className="h-[calc(5rem+env(safe-area-inset-bottom))]" />
    </div>
  );
}
