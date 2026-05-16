import { z } from "zod";

const objectId = z.string().min(1);

export const createOrUpdateIntentSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    description: z.string().trim().optional(),
    confidenceThreshold: z.number().min(0).max(1).optional(),
  }),
});

export const trainTokenSchema = z.object({
  body: z.object({
    token: z.string().trim().min(1),
    intentId: objectId,
    weight: z.number().min(0.1).max(5).optional(),
  }),
});

export const trainAnswerSchema = z.object({
  body: z.object({
    intentId: objectId,
    content: z.string().trim().min(2),
    priority: z.number().min(1).max(10).optional(),
  }),
});

export const validateTokenRelationSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    similarity: z.number().min(0).max(1).optional(),
  }),
});

export const relationIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const approveTrainingSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    finalResponse: z.string().trim().optional(),
    intentIds: z.array(objectId).optional(),
  }),
});
