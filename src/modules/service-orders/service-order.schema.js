import { z } from "zod";

const serviceOrderStatus = [
  "RECEIVED",
  "IN_ANALYSIS",
  "WAITING_APPROVAL",
  "APPROVED",
  "IN_REPAIR",
  "COMPLETED",
  "DELIVERED",
  "CANCELED",
];

export const createServiceOrderSchema = z.object({
  body: z.object({
    client: z.string().min(1),
    device: z.string().min(1),

    technician: z.string().optional(),

    estimatedBudget: z.number().optional(),

    diagnosis: z.string().optional(),

    technicalReport: z.string().optional(),

    internalNotes: z.string().optional(),
  }),
});

export const updateServiceOrderSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),

  body: z.object({
    technician: z.string().optional(),

    status: z.enum(serviceOrderStatus).optional(),

    estimatedBudget: z.number().optional(),

    finalPrice: z.number().optional(),

    approvedByClient: z.boolean().optional(),

    diagnosis: z.string().optional(),

    technicalReport: z.string().optional(),

    internalNotes: z.string().optional(),
  }),
});

export const serviceOrderIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
