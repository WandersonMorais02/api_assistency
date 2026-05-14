import { z } from "zod";

export const createProductCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome precisa ter pelo menos 2 caracteres"),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateProductCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID da categoria é obrigatório"),
  }),

  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const productCategoryIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID da categoria é obrigatório"),
  }),
});
