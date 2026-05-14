import { z } from "zod";

const orderStatus = ["PENDING", "CONFIRMED", "PAID", "DELIVERED", "CANCELED"];
const paymentStatus = ["PENDING", "PAID", "REFUNDED"];

export const createOrderSchema = z.object({
  body: z.object({
    client: z.string().optional(),

    customerName: z.string().min(3, "Nome é obrigatório"),
    customerPhone: z.string().min(8, "Telefone é obrigatório"),
    customerEmail: z.string().email("E-mail inválido").optional().or(z.literal("")),

    items: z
      .array(
        z.object({
          product: z.string().min(1, "Produto é obrigatório"),
          quantity: z.coerce.number().int().min(1, "Quantidade inválida"),
        })
      )
      .min(1, "Pedido precisa ter pelo menos 1 item"),

    notes: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID do pedido é obrigatório"),
  }),

  body: z.object({
    status: z.enum(orderStatus).optional(),
    paymentStatus: z.enum(paymentStatus).optional(),
    notes: z.string().optional(),
  }),
});

export const orderIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID do pedido é obrigatório"),
  }),
});
