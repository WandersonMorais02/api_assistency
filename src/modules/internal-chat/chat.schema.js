import { z } from "zod";

const objectId = z.string().min(1);

export const createRoomSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    type: z.enum([
      "PRIVATE",
      "GROUP",
      "SUPPORT",
      "BOT",
    ]),

    participants: z
      .array(objectId)
      .min(1),
  }),
});

export const sendMessageSchema = z.object({
  body: z.object({
    room: objectId,

    type: z
      .enum([
        "TEXT",
        "IMAGE",
        "FILE",
        "SYSTEM",
        "BOT",
      ])
      .optional(),

    content: z
      .string()
      .trim()
      .min(1)
      .max(5000),

    attachments: z
      .array(objectId)
      .optional(),
  }),
});

export const roomIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const messageIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const markMessageAsReadSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const listMessagesSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional(),

    limit: z
      .string()
      .optional(),
  }),
});
