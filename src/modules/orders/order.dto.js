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
  path: z.string().optional(),
  filename: z.string().optional(),
  originalName: z.string().optional(),
  mimetype: z.string().optional(),
  mimeType: z.string().optional(),
  category: z.string().optional(),
  context: z.string().optional(),
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

const shippingAddressSchema = z
  .object({
    zipCode: z.string().nullable().optional(),
    street: z.string().nullable().optional(),
    number: z.string().nullable().optional(),
    complement: z.string().nullable().optional(),
    neighborhood: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

const orderOutputSchema = z.object({
  id: z.string(),

  client: clientSchema,

  customerName: z.string().nullable().optional(),
  customerPhone: z.string().nullable().optional(),
  customerEmail: z.string().nullable().optional(),

  shippingAddress: shippingAddressSchema,

  items: z.array(itemSchema),

  total: z.number(),

  status: z.string(),
  paymentStatus: z.string(),

  gateway: z.string().nullable().optional(),
  gatewayPreferenceId: z.string().nullable().optional(),
  gatewayPaymentId: z.string().nullable().optional(),
  checkoutUrl: z.string().nullable().optional(),
  externalReference: z.string().nullable().optional(),

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
    path: image.path,
    filename: image.filename,
    originalName: image.originalName,
    mimetype: image.mimetype || image.mimeType,
    mimeType: image.mimeType || image.mimetype,
    category: image.category,
    context: image.context,
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

function shippingAddressDTO(address) {
  if (!address) return null;

  return removeEmptyFields({
    zipCode: address.zipCode || null,
    street: address.street || null,
    number: address.number || null,
    complement: address.complement || null,
    neighborhood: address.neighborhood || null,
    city: address.city || null,
    state: address.state || null,
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

    shippingAddress: shippingAddressDTO(order.shippingAddress),

    items: mapArray(order.items, itemDTO),

    total: order.total,

    status: order.status,
    paymentStatus: order.paymentStatus,

    gateway: order.gateway || null,
    gatewayPreferenceId: order.gatewayPreferenceId || null,
    gatewayPaymentId: order.gatewayPaymentId || null,
    checkoutUrl: order.checkoutUrl || null,
    externalReference: order.externalReference || null,

    notes: order.notes || null,

    isActive: order.isActive,

    createdAt: toDate(order.createdAt),
    updatedAt: toDate(order.updatedAt),
  });

  return orderOutputSchema.parse(data);
}
