import { z } from "zod";

export const createDeviceTypeSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome precisa ter pelo menos 2 caracteres"),
    isActive: z.boolean().optional(),
  }),
});

export const updateDeviceTypeSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID do tipo é obrigatório"),
  }),

  body: z.object({
    name: z.string().min(2).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const deviceTypeIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID do tipo é obrigatório"),
  }),
});
