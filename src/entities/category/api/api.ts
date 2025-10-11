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

export async function createCategory(category: string): Promise<void> {
  return client.post("/recipes/categories", { name: category });
}

export async function deleteCategory(categoryId: string): Promise<void> {
  return await client.delete(`/recipes/categories/${categoryId}`);
}