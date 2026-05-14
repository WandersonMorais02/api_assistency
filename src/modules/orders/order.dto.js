import { z } from "zod";

import {
  toId,
  toDate,
  mapArray,
  removeEmptyFields,
} from "../../core/dtos/base.dto.js";

const clientSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    phone: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    cpf: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

const imageSchema = z.object({
  id: z.string(),
  url: z.string().optional(),
});

const productSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    slug: z.string().optional(),
    images: z.array(imageSchema).optional(),
  })
  .nullable()
  .optional();

const itemSchema = z.object({
  product: productSchema,

  name: z.string(),

  quantity: z.number(),

  unitPrice: z.number(),

  subtotal: z.number(),
});

const orderOutputSchema = z.object({
  id: z.string(),

  client: clientSchema,

  customerName: z.string().nullable().optional(),
  customerPhone: z.string().nullable().optional(),
  customerEmail: z.string().nullable().optional(),

  items: z.array(itemSchema),

  total: z.number(),

  status: z.string(),
  paymentStatus: z.string(),

  notes: z.string().nullable().optional(),

  isActive: z.boolean(),

  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

function clientDTO(client) {
  if (!client) return null;

  return removeEmptyFields({
    id: toId(client),
    name: client.name,
    phone: client.phone || null,
    email: client.email || null,
    cpf: client.cpf || null,
  });
}

function imageDTO(image) {
  if (!image) return null;

  return removeEmptyFields({
    id: toId(image),
    url: image.url,
  });
}

function productDTO(product) {
  if (!product) return null;

  return removeEmptyFields({
    id: toId(product),
    name: product.name,
    slug: product.slug,
    images: mapArray(product.images, imageDTO),
  });
}

function itemDTO(item) {
  return removeEmptyFields({
    product: productDTO(item.product),

    name: item.name,

    quantity: item.quantity,

    unitPrice: item.unitPrice,

    subtotal: item.subtotal,
  });
}

export function orderDTO(order) {
  if (!order) return null;

  const data = removeEmptyFields({
    id: toId(order),

    client: clientDTO(order.client),

    customerName: order.customerName || null,
    customerPhone: order.customerPhone || null,
    customerEmail: order.customerEmail || null,

    items: mapArray(order.items, itemDTO),

    total: order.total,

    status: order.status,
    paymentStatus: order.paymentStatus,

    notes: order.notes || null,

    isActive: order.isActive,

    createdAt: toDate(order.createdAt),
    updatedAt: toDate(order.updatedAt),
  });

  return orderOutputSchema.parse(data);
}
