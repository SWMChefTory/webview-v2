import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchCategories, CategoryResponse, deleteCategory as deleteCategoryApi } from "../api/api";
import { ALL_RECIPES } from "@/src/entities/user_recipe/model/useUserRecipe";
import { QUERY_KEY, QUERY_KEY_UNCATEGORIZED } from "@/src/entities/user_recipe/model/useUserRecipe";

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

const CATEGORY_QUERY_KEY = "categories";

export const useFetchCategories = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [CATEGORY_QUERY_KEY],
    queryFn: fetchCategories,
    select: (res) => {
      if (!res) {
        throw new Error("Response is not valid");
      }
      return res.map(Category.create);
    },
  });
  return { data, isLoading, error };
};

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteCategory, isPending , error} = useMutation({
    mutationFn: (categoryId: string) => {
      return deleteCategoryApi(categoryId);
    },
    
    onSuccess: (_, categoryId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, categoryId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_UNCATEGORIZED] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });

  return { deleteCategory, isPending, error };
}
