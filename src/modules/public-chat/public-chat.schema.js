import { z } from "zod";

export const startPublicChatSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    phone: z.string().trim().min(8),

    email: z
      .string()
      .email()
      .optional()
      .or(z.literal("")),

    message: z
      .string()
      .trim()
      .min(1)
      .max(5000),
  }),
});

export const publicChatTokenSchema = z.object({
  params: z.object({
    token: z.string().min(10),
  }),
});

export const sendPublicMessageSchema = z.object({
  params: z.object({
    token: z.string().min(10),
  }),

  body: z.object({
    message: z
      .string()
      .trim()
      .min(1)
      .max(5000),
  }),
});
