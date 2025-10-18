import client from "@/src/shared/client/main/client";
import { CategoriesSchema} from "@/src/shared/schema/categorySchema";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";

export async function fetchCategories() {
  const response = await client.get("/recipes/categories");
  return parseWithErrLog(CategoriesSchema, response.data);
}

export async function createCategory(categoryName: string): Promise<void> {
  return await client.post("/recipes/categories", { name: categoryName });
}

export async function deleteCategory(categoryId: string): Promise<void> {
  return await client.delete(`/recipes/categories/${categoryId}`);
}

export async function enrollCategory(
  recipeId: string,
  targetCategoryId: string
): Promise<void> {
  const request = {
    categoryId: targetCategoryId,
  };
  return await client.put(`/recipes/${recipeId}/categories`, request);
}
