import { z } from "zod";

// 제너릭 함수로 Paginated 스키마 생성
export function createPaginatedSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    currentPage: z.number().optional(),
    hasNext: z.boolean(),
    totalElements: z.number().optional(),
    totalPages: z.number().optional(),
    data: dataSchema,
  });
}

export const createCursorPaginatedSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    nextCursor: z.string().nullable(),
    hasNext: z.boolean(),
    data: dataSchema,
  });


// export default createPaginatedSchema;
