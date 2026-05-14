import { z } from "zod";

import {
  toId,
  toDate,
  mapArray,
  removeEmptyFields,
} from "../../core/dtos/base.dto.js";

const categorySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  slug: z.string().optional(),
}).nullable().optional();

const imageSchema = z.object({
  id: z.string(),
  url: z.string().optional(),
  mimetype: z.string().optional(),
  category: z.string().optional(),
  context: z.string().optional(),
});

const productOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  category: categorySchema,

  description: z.string().nullable().optional(),

  price: z.number(),
  promotionalPrice: z.number().nullable().optional(),
  stock: z.number(),

  condition: z.string(),

  images: z.array(imageSchema).optional(),

  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  isActive: z.boolean(),

  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

function categoryDTO(category) {
  if (!category) return null;

  return removeEmptyFields({
    id: toId(category),
    name: category.name,
    slug: category.slug,
  });
}

function imageDTO(image) {
  if (!image) return null;

  return removeEmptyFields({
    id: toId(image),
    url: image.url,
    mimetype: image.mimetype,
    category: image.category,
    context: image.context,
  });
}

export function productDTO(product) {
  if (!product) return null;

  const data = removeEmptyFields({
    id: toId(product),
    name: product.name,
    slug: product.slug,

    category: categoryDTO(product.category),

    description: product.description || null,

    price: product.price,
    promotionalPrice: product.promotionalPrice ?? null,
    stock: product.stock,

    condition: product.condition,

    images: mapArray(product.images, imageDTO),

    isFeatured: product.isFeatured,
    isPublished: product.isPublished,
    isActive: product.isActive,

    createdAt: toDate(product.createdAt),
    updatedAt: toDate(product.updatedAt),
  });

  return productOutputSchema.parse(data);
}
