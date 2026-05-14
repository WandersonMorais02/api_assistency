import { z } from "zod";

import {
  toId,
  toDate,
  removeEmptyFields,
} from "../../core/dtos/base.dto.js";

const productCategoryOutputSchema = z.object({
  id: z.string(),

  name: z.string(),
  slug: z.string(),

  description: z.string().nullable().optional(),

  isActive: z.boolean(),

  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export function productCategoryDTO(category) {
  if (!category) return null;

  const data = removeEmptyFields({
    id: toId(category),

    name: category.name,
    slug: category.slug,

    description: category.description || null,

    isActive: category.isActive,

    createdAt: toDate(category.createdAt),
    updatedAt: toDate(category.updatedAt),
  });

  return productCategoryOutputSchema.parse(data);
}

export function productCategoriesDTO(categories = []) {
  return categories.map(productCategoryDTO);
}
