import { z } from "zod";

export const protocolSchema = z.object({
  params: z.object({
    protocol: z.string().min(5, "Protocolo inválido"),
  }),
});

export const approveBudgetSchema = z.object({
  params: z.object({
    protocol: z.string().min(5, "Protocolo inválido"),
  }),

  body: z.object({
    approved: z.boolean(),
    customerNote: z.string().optional(),
  }),
});
