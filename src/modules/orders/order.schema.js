import { z } from "zod";

const objectIdSchema = z.string().min(1, "ID inválido");

const orderStatus = [
  "PENDING",
  "CONFIRMED",
  "PAID",
  "PROCESSING",
  "DELIVERED",
  "CANCELED",
];

const paymentStatus = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "CANCELED",
];

const orderItemSchema = z.object({
  product: objectIdSchema,
  quantity: z.coerce.number().int().min(1, "Quantidade inválida"),
});

const shippingAddressSchema = z.object({
  zipCode: z.string().min(3, "CEP é obrigatório"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional().or(z.literal("")),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "UF inválida").max(2, "UF inválida"),
});

export const createOrderSchema = z.object({
  body: z.object({
    client: objectIdSchema.optional(),

    customerName: z.string().min(3, "Nome é obrigatório"),
    customerPhone: z.string().min(8, "Telefone é obrigatório"),
    customerEmail: z
      .string()
      .email("E-mail inválido")
      .optional()
      .or(z.literal("")),

    shippingAddress: shippingAddressSchema.optional(),

    items: z.array(orderItemSchema).min(1, "Pedido precisa ter pelo menos 1 item"),

    notes: z.string().optional().or(z.literal("")),

    gateway: z.enum(["MANUAL", "MERCADO_PAGO"]).optional(),
  }),
});

export const createCheckoutOrderSchema = z.object({
  body: z.object({
    client: objectIdSchema.optional(),

    customerName: z.string().min(3, "Nome é obrigatório"),
    customerPhone: z.string().min(8, "Telefone é obrigatório"),
    customerEmail: z.string().email("E-mail inválido"),

    shippingAddress: shippingAddressSchema,

    items: z.array(orderItemSchema).min(1, "Pedido precisa ter pelo menos 1 item"),

    notes: z.string().optional().or(z.literal("")),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),

  body: z.object({
    status: z.enum(orderStatus).optional(),
    paymentStatus: z.enum(paymentStatus).optional(),
    notes: z.string().optional().or(z.literal("")),
  }),
});

export const orderIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
