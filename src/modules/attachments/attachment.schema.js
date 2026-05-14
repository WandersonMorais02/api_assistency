import { z } from "zod";

export const uploadAttachmentSchema = z.object({
  body: z.object({
    context: z.enum([
      "PRODUCT_IMAGE",
      "DEVICE_IMAGE",
      "JOB_IMAGE",
      "JOB_RESUME",
      "CONSENT_DOCUMENT",
      "CONSENT_AUDIO",
      "CONSENT_VIDEO",
      "SERVICE_ORDER_ATTACHMENT",
    ]),

    relatedTo: z.string().optional(),
  }),
});

export const attachmentIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID do anexo é obrigatório"),
  }),
});
