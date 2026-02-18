import client from "@/src/shared/client/main/client";
import { useEffect, useRef, useState } from "react";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { Sheet } from "react-modal-sheet";
import { useRecipeDetailTranslation } from "../hook/useRecipeDetailTranslation";

interface CoupangProduct {
  keyword: string;
  rank: number;
  isRocket: boolean;
  isFreeShipping: boolean;
  productId: number;
  productImage: string;
  productName: string;
  productPrice: number;
  productUrl: string;
}

interface IngredientProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  purchaseUrl: string;
  isRocket?: boolean;
}

type Ingredient = { name: string; amount?: number; unit?: string };

interface IngredientPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredients: Ingredient[];
  recipeId: string;
}

const FALLBACK_IMAGE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect fill='%23f3f4f6' width='96' height='96'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32'%3E🛒%3C/text%3E%3C/svg%3E";

export const IngredientPurchaseModal = ({
  open,
  onOpenChange,
  ingredients,
  recipeId,
}: IngredientPurchaseModalProps) => {
  const { t } = useRecipeDetailTranslation();
  const [products, setProducts] = useState<IngredientProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // Amplitude 추적용 ref
  const modalOpenTime = useRef<number>(0);
  const clickedProducts = useRef<string[]>([]);
  const hasTrackedClose = useRef<boolean>(false);
  const productsDisplayedRef = useRef<number>(0);

  // products 변경 시 ref 동기화 (클로저 이슈 해결)
  useEffect(() => {
    productsDisplayedRef.current = products.length;
  }, [products]);

  // 모달 닫힘 추적 함수
  const trackModalClose = () => {
    if (hasTrackedClose.current) return;
    hasTrackedClose.current = true;

    track(AMPLITUDE_EVENT.COUPANG_MODAL_CLOSE, {
      recipe_id: recipeId,
      products_displayed: productsDisplayedRef.current,
      products_clicked: clickedProducts.current.length,
      clicked_products: clickedProducts.current,
      duration_seconds: Math.round((Date.now() - modalOpenTime.current) / 1000),
    });
  };

  // 모달 열림/닫힘 시 이벤트 처리
  useEffect(() => {
    if (open) {
      modalOpenTime.current = Date.now();
      clickedProducts.current = [];
      hasTrackedClose.current = false;
      productsDisplayedRef.current = 0;

      track(AMPLITUDE_EVENT.COUPANG_MODAL_OPEN, {
        recipe_id: recipeId,
        ingredient_count: ingredients.length,
      });
    }

    return () => {
      if (open && !hasTrackedClose.current) {
        trackModalClose();
      }
    };
  }, [open, recipeId, ingredients.length]);

  // 상품 클릭 핸들러
  const handleProductClick = (product: IngredientProduct, index: number) => {
    clickedProducts.current.push(product.id);

    track(AMPLITUDE_EVENT.COUPANG_PRODUCT_CLICK, {
      recipe_id: recipeId,
      ingredient_name: product.name,
      product_id: product.id,
      product_name: product.description,
      price: product.price,
      is_rocket: product.isRocket ?? false,
      position: index,
    });
  };

  // 모달 닫힘 핸들러
  const handleClose = () => {
    trackModalClose();
    onOpenChange(false);
  };

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    if (open && ingredients.length > 0) {
      setLoading(true);

      // 각 재료마다 API 호출
      const fetchPromises = ingredients.map(async (ingredient) => {
        try {
          const response = await client.get(
            `/affiliate/search/coupang?keyword=${encodeURIComponent(
              ingredient.name
            )}`,
            { signal: abortController.signal }
          );

          const coupangProducts: CoupangProduct[] =
            response.data?.coupangProducts?.coupangProducts ?? [];

          // 유효한 상품만 필터링
          const validProducts = coupangProducts.filter((p) => {
            return (
              p &&
              typeof p.productId === "number" &&
              typeof p.productName === "string" &&
              typeof p.productPrice === "number" &&
              typeof p.productUrl === "string" &&
              typeof p.productImage === "string"
            );
          });

          // 가격이 가장 싼 상품 하나 선택
          if (validProducts.length > 0) {
            const cheapestProduct = validProducts.reduce((prev, curr) =>
              curr.productPrice < prev.productPrice ? curr : prev
            );

            return {
              id: `${cheapestProduct.productId}`,
              name: ingredient.name,
              description: cheapestProduct.productName,
              price: cheapestProduct.productPrice,
              imageUrl: cheapestProduct.productImage,
              purchaseUrl: cheapestProduct.productUrl,
              isRocket: cheapestProduct.isRocket ?? false,
            } satisfies IngredientProduct;
          }

          return null;
        } catch (error) {
          if (
            (error as Error).name === "AbortError" ||
            (error as Error).name === "CanceledError"
          ) {
            return null;
          }
          return null;
        }
      });

      Promise.all(fetchPromises)
        .then((results) => {
          if (!isMounted) return;

          // null이 아닌 상품만 필터링
          const validProducts = results.filter((product) => product !== null);
          setProducts(validProducts);
        })
        .catch((error) => {
          // Promise.all이 reject되는 경우 처리
          if (isMounted) {
            setProducts([]);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    } else if (open && ingredients.length === 0) {
      // 재료가 없는 경우 초기화
      setProducts([]);
      setLoading(false);
    }

    return () => {
      isMounted = false;
      abortController.abort(); // 진행 중인 모든 요청 취소
    };
  }, [open, ingredients]);

  return (
    <Sheet isOpen={open} onClose={handleClose} detent="content">
      <Sheet.Container className="!bg-white !rounded-t-3xl !shadow-2xl">
        <Sheet.Header className="!pt-3 !pb-0">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
        </Sheet.Header>
        <Sheet.Content className="!px-0">
          <div className="max-h-[75vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="relative px-5 pt-4 pb-4 border-b border-gray-100">
              <button
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors active:scale-95"
                onClick={handleClose}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <h2 className="text-xl font-bold text-neutral-900 mb-1 pr-8 whitespace-pre-line">
                {t("coupang.title")}
              </h2>
              <p className="text-xs text-gray-500">
                {t("coupang.disclaimer")}
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <svg
                    className="w-16 h-16 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="text-sm">{t("coupang.noProducts")}</p>
                </div>
              ) : (
                <div className="space-y-3 pb-4">
                  {products.map((product, index) => (
                    <a
                      key={product.id}
                      href={product.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all active:scale-[0.98]"
                      onClick={() => handleProductClick(product, index)}
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              FALLBACK_IMAGE_SVG;
                          }}
                        />
                        {product.isRocket && (
                          <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {t("coupang.rocket")}
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="font-bold text-base text-neutral-900 mb-0.5">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                        <p className="font-bold text-lg text-neutral-900">
                          {t("coupang.price", { price: product.price.toLocaleString() })}
                        </p>
                      </div>

                      {/* Arrow Icon */}
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M9 18L15 12L9 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} className="!bg-black/50" />
    </Sheet>
  );
};
