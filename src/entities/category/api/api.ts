import client from "@/src/shared/client/main/client";
import { z } from "zod";

const CategorySchema = z.object({
  categoryId: z.string(),
  count: z.number(),
  name: z.string(),
});

const CategoryResponseSchema = z.object({
  categories: z.array(CategorySchema),
});

export type CategoryResponse = z.infer<typeof CategorySchema>;
export type CategoryListResponse = z.infer<typeof CategoryResponseSchema>;

export async function fetchCategories() {
  const response = await client.get("/recipes/categories");
  return CategoryResponseSchema.parse(response.data).categories;
}

export async function createCategory(categoryName: string): Promise<void> {
  return await client.post("/recipes/categories", { name: categoryName });
}

export async function deleteCategory(categoryId: string): Promise<void> {
  return await client.delete(`/recipes/categories/${categoryId}`);
}

export async function updateCategory({
  recipeId,
  targetCategoryId,
}: {
  recipeId: string;
  targetCategoryId: string;
}): Promise<void> {
  const request = {
    category_id: targetCategoryId,
  };
  return await client.put(`/recipes/${recipeId}/categories`, request);
}
