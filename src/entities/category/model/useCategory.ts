import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  fetchCategories,
  deleteCategory as deleteCategoryApi,
  createCategory as createCategoryApi,
} from "../api/api";
import { ALL_RECIPES } from "@/src/entities/user-recipe/model/useUserRecipe";
import {
  ALL_RECIPES as USER_RECIPE_QUERY_KEY,
} from "@/src/entities/user-recipe/model/useUserRecipe";
import { Category as CategoryResponse } from "@/src/shared/schema/categorySchema";

export class Category {
  id!: string;
  name!: string;
  count!: number;

  private constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }

  static create(category: CategoryResponse) {
    return new Category({
      id: category.categoryId,
      name: category.name,
      count: category.count,
    });
  }

  static createAllRecipeCategory({ count }: { count: number }) {
    return new Category({
      id: ALL_RECIPES,
      name: "전체",
      count: count,
    });
  }
}

export const CATEGORY_QUERY_KEY = "categories";

export const useFetchCategories = () => {
  const { data, isLoading, error } = useSuspenseQuery({
    queryKey: [CATEGORY_QUERY_KEY],
    queryFn: fetchCategories,
    select: (res) => {
      if (!res) {
        throw new Error("Response is not valid");
      }
      return res.categories.map(Category.create);
    },
  });
  return { data, isLoading, error };
};

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteCategory,
    isPending,
    error,
  } = useMutation({
    mutationFn: (categoryId: string) => {
      return deleteCategoryApi(categoryId);
    },
    onSuccess: (_, categoryId) => {
      queryClient.invalidateQueries({ queryKey: [USER_RECIPE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });

  return { deleteCategory, isPending, error };
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const {
    mutateAsync: createCategory,
    isPending,
    error,
  } = useMutation({
    mutationFn: (categoryName: string) => {
      return createCategoryApi(categoryName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
  return { createCategory, isPending, error };
}
