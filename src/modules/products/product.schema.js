import { z } from "zod";

const conditionEnum = ["NEW", "USED", "REFURBISHED"];

const optionalStringSchema = z
  .string()
  .optional()
  .or(z.literal(""));

const optionalNumberSchema = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    return value;
  },
  z.coerce.number().min(0).optional()
);

const optionalIntegerSchema = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    return value;
  },
  z.coerce.number().int().min(0).optional()
);

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome precisa ter pelo menos 2 caracteres"),
    description: optionalStringSchema,
    category: optionalStringSchema,

    price: z.coerce.number().min(0, "Preço inválido"),
    promotionalPrice: optionalNumberSchema,

    stock: optionalIntegerSchema,

    condition: z.enum(conditionEnum).optional(),

    images: z.array(z.string()).optional(),

    isFeatured: z.coerce.boolean().optional(),
    isPublished: z.coerce.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID do produto é obrigatório"),
  }),

  body: z.object({
    name: z.string().min(2).optional(),
    description: optionalStringSchema,
    category: optionalStringSchema,

    price: optionalNumberSchema,
    promotionalPrice: optionalNumberSchema,

    stock: optionalIntegerSchema,

    condition: z.enum(conditionEnum).optional(),

    images: z.array(z.string()).optional(),

    isFeatured: z.coerce.boolean().optional(),
    isPublished: z.coerce.boolean().optional(),
    isActive: z.coerce.boolean().optional(),
  }),
});

export const productIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID do produto é obrigatório"),
  }),
});

export const productSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug do produto é obrigatório"),
  }),
});
