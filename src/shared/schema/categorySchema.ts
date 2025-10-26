import z from "zod";

const CategorySchema = z.object({
  categoryId: z.string(),
  count: z.number(),
  name: z.string(),
});

const CategoriesSchema = z.object({
    categories: z.array(CategorySchema),
});

export type Category = z.infer<typeof CategorySchema>;
export type CategoryList = z.infer<typeof CategoriesSchema>;

export { CategorySchema, CategoriesSchema };