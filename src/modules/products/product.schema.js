import { z } from "zod";

const conditionEnum = ["NEW", "USED", "REFURBISHED"];

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome precisa ter pelo menos 2 caracteres"),
    description: z.string().optional().or(z.literal("")),
    category: z.string().optional().or(z.literal("")),

    price: z.coerce.number().min(0, "Preço inválido"),
    promotionalPrice: z.coerce.number().min(0).optional(),

    stock: z.coerce.number().int().min(0).optional(),

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
    description: z.string().optional().or(z.literal("")),
    category: z.string().optional().or(z.literal("")),

    price: z.coerce.number().min(0).optional(),
    promotionalPrice: z.coerce.number().min(0).optional(),

    stock: z.coerce.number().int().min(0).optional(),

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
