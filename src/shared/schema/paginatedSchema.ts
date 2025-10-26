import { z } from "zod";

// 제너릭 함수로 Paginated 스키마 생성
function createPaginatedSchema<T extends z.ZodTypeAny>(
  dataSchema: T,
) {
  return z.object({
    currentPage: z.number(),
    hasNext: z.boolean(),
    totalElements: z.number(),
    totalPages: z.number(),
    data: dataSchema,
  });
}

export default createPaginatedSchema;
