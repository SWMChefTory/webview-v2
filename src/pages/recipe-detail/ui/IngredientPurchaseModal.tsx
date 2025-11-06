import client from "@/src/shared/client/main/client";
import { useEffect, useState } from "react";

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
}

export const IngredientPurchaseModal = ({
  open,
  onOpenChange,
  ingredients,
}: IngredientPurchaseModalProps) => {
  const [products, setProducts] = useState<IngredientProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && ingredients.length > 0) {
      setLoading(true);

      // 각 재료마다 API 호출
      const fetchPromises = ingredients.map(async (ingredient) => {
        try {
          const response = await client.get(
            `/affiliate/search/coupang?keyword=${encodeURIComponent(
              ingredient.name
            )}`
          );

          console.log(
            `[${ingredient.name}] API Response:`,
            JSON.stringify(response.data, null, 2)
          );

          // 응답에서 첫 번째 상품만 추출
          const coupangProducts =
            response.data?.coupangProducts?.coupangProducts;
          if (Array.isArray(coupangProducts) && coupangProducts.length > 0) {
            const firstProduct = coupangProducts[0] as CoupangProduct;
            return {
              id: `${firstProduct.productId}`,
              name: ingredient.name,
              description: firstProduct.productName,
              price: firstProduct.productPrice,
              imageUrl: firstProduct.productImage,
              purchaseUrl: firstProduct.productUrl,
              isRocket: firstProduct.isRocket,
            } as IngredientProduct;
          }
          return null;
        } catch (error) {
          console.error(`[${ingredient.name}] API Error:`, error);
          return null;
        }
      });

      Promise.all(fetchPromises)
        .then((results) => {
          // null이 아닌 상품만 필터링
          const validProducts = results.filter(
            (product): product is IngredientProduct => product !== null
          );
          console.log("Valid Products:", validProducts);
          setProducts(validProducts);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, ingredients]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[1000] animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-[1001] animate-in slide-in-from-bottom duration-300">
        <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="relative px-5 pt-6 pb-4 border-b border-gray-100">
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
              onClick={() => onOpenChange(false)}
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

            <h2 className="text-xl font-bold text-neutral-900 mb-1 pr-8">
              지금 필요한 재료,
              <br />
              쿠팡에서 바로 준비해보세요!
            </h2>
            <p className="text-xs text-gray-500">
              쿠팡 파트너스 활동의 일환으로 수수료를 일부 제공 받습니다.
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
                <p className="text-sm">등록된 상품이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <a
                    key={product.id}
                    href={product.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow active:scale-[0.98]"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect fill='%23f3f4f6' width='96' height='96'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32'%3E🛒%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      {product.isRocket && (
                        <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          로켓
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
                        {product.price.toLocaleString()}원
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
      </div>
    </>
  );
};
