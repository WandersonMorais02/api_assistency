import { z } from "zod";

import {
  toId,
  toDate,
  removeEmptyFields,
} from "../../core/dtos/base.dto.js";

const uploadedBySchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    email: z.string().nullable().optional(),
    role: z.string().optional(),
  })
  .nullable()
  .optional();

const attachmentOutputSchema = z.object({
  id: z.string(),

  originalName: z.string(),
  filename: z.string(),

  path: z.string(),
  url: z.string(),

  mimetype: z.string(),

  size: z.number(),

  category: z.string(),
  context: z.string(),

  relatedTo: z.string().nullable().optional(),

  uploadedBy: uploadedBySchema,

  isActive: z.boolean(),

  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

function uploadedByDTO(user) {
  if (!user) return null;

  return removeEmptyFields({
    id: toId(user),
    name: user.name,
    email: user.email || null,
    role: user.role,
  });
}

export function attachmentDTO(attachment) {
  if (!attachment) return null;

  const data = removeEmptyFields({
    id: toId(attachment),

    originalName: attachment.originalName,
    filename: attachment.filename,

    path: attachment.path,
    url: attachment.url,

    mimetype: attachment.mimetype,

    size: attachment.size,

    category: attachment.category,
    context: attachment.context,

    relatedTo: attachment.relatedTo
      ? toId(attachment.relatedTo)
      : null,

    uploadedBy: uploadedByDTO(attachment.uploadedBy),

    isActive: attachment.isActive,

    createdAt: toDate(attachment.createdAt),
    updatedAt: toDate(attachment.updatedAt),
  });

  return attachmentOutputSchema.parse(data);
}
