import { z } from "zod";

const paymentContexts = ["SERVICE_ORDER", "ORDER"];

const paymentMethods = [
  "CASH",
  "PIX",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "BANK_TRANSFER",
  "OTHER",
];

const paymentStatus = ["PENDING", "PAID", "CANCELED", "REFUNDED"];

export const createPaymentSchema = z.object({
  body: z.object({
    context: z.enum(paymentContexts),
    relatedTo: z.string().min(1, "ID relacionado é obrigatório"),

    amount: z.coerce.number().min(0.01, "Valor inválido"),

    method: z.enum(paymentMethods),
    status: z.enum(paymentStatus).optional(),

    notes: z.string().optional(),
  }),
});

export const updatePaymentSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID do pagamento é obrigatório"),
  }),

  body: z.object({
    amount: z.coerce.number().min(0.01).optional(),
    method: z.enum(paymentMethods).optional(),
    status: z.enum(paymentStatus).optional(),
    notes: z.string().optional(),
  }),
});

export const paymentIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID do pagamento é obrigatório"),
  }),
});
