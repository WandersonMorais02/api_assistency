import { z } from "zod";

const addressSchema = z
  .object({
    street: z.string().optional(),
    number: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  })
  .optional();

export const createClientSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Nome precisa ter pelo menos 3 caracteres"),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    phone: z.string().min(8, "Telefone é obrigatório"),
    cpf: z.string().optional(),
    address: addressSchema,
    notes: z.string().optional(),
  }),
});

export const updateClientSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID do cliente é obrigatório"),
  }),

  body: z.object({
    name: z.string().min(3).optional(),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    phone: z.string().min(8).optional(),
    cpf: z.string().optional(),
    address: addressSchema,
    notes: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const clientIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID do cliente é obrigatório"),
  }),
});
