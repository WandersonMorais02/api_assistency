import { z } from "zod";

import {
  toId,
  toDate,
  removeEmptyFields,
} from "../../core/dtos/base.dto.js";

const receivedBySchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    email: z.string().nullable().optional(),
    role: z.string().optional(),
  })
  .nullable()
  .optional();

const paymentOutputSchema = z.object({
  id: z.string(),

  context: z.string(),
  relatedTo: z.string(),

  amount: z.number(),

  method: z.string(),
  status: z.string(),

  paidAt: z.string().nullable().optional(),

  notes: z.string().nullable().optional(),

  gateway: payment.gateway,
  gatewayPaymentId: payment.gatewayPaymentId,
  gatewayPreferenceId: payment.gatewayPreferenceId,
  checkoutUrl: payment.checkoutUrl,
  externalReference: payment.externalReference,

  receivedBy: receivedBySchema,

  isActive: z.boolean(),

  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

function receivedByDTO(user) {
  if (!user) return null;

  return removeEmptyFields({
    id: toId(user),
    name: user.name,
    email: user.email || null,
    role: user.role,
  });
}

export function paymentDTO(payment) {
  if (!payment) return null;

  const data = removeEmptyFields({
    id: toId(payment),

    context: payment.context,
    relatedTo: toId(payment.relatedTo),

    amount: payment.amount,

    method: payment.method,
    status: payment.status,

    paidAt: toDate(payment.paidAt),

    notes: payment.notes || null,

    receivedBy: receivedByDTO(payment.receivedBy),

    gateway: payment.gateway,
    gatewayPaymentId: payment.gatewayPaymentId,
    gatewayPreferenceId: payment.gatewayPreferenceId,
    checkoutUrl: payment.checkoutUrl,
    externalReference: payment.externalReference,

    isActive: payment.isActive,

    createdAt: toDate(payment.createdAt),
    updatedAt: toDate(payment.updatedAt),
  });

  return paymentOutputSchema.parse(data);
}
