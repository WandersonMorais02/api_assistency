import { z } from "zod";

import {
  toId,
  toDate,
  mapArray,
  removeEmptyFields,
} from "../../core/dtos/base.dto.js";

const attachmentSchema = z
  .object({
    id: z.string(),
    originalName: z.string().optional(),
    url: z.string().optional(),
    mimetype: z.string().optional(),
    category: z.string().optional(),
    context: z.string().optional(),
  })
  .nullable()
  .optional();

const applicationSchema = z.object({
  id: z.string(),

  name: z.string(),
  email: z.string(),
  phone: z.string(),

  message: z.string().nullable().optional(),

  resume: attachmentSchema,

  status: z.string(),

  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

const jobOutputSchema = z.object({
  id: z.string(),

  title: z.string(),
  slug: z.string(),

  description: z.string(),

  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),

  location: z.string().nullable().optional(),
  type: z.string(),

  image: attachmentSchema,

  applications: z.array(applicationSchema).optional(),

  isPublished: z.boolean(),
  isActive: z.boolean(),

  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

function attachmentDTO(attachment) {
  if (!attachment) return null;

  return removeEmptyFields({
    id: toId(attachment),
    originalName: attachment.originalName,
    url: attachment.url,
    mimetype: attachment.mimetype,
    category: attachment.category,
    context: attachment.context,
  });
}

function applicationDTO(application) {
  if (!application) return null;

  return removeEmptyFields({
    id: toId(application),

    name: application.name,
    email: application.email,
    phone: application.phone,

    message: application.message || null,

    resume: attachmentDTO(application.resume),

    status: application.status,

    createdAt: toDate(application.createdAt),
    updatedAt: toDate(application.updatedAt),
  });
}

export function jobDTO(job) {
  if (!job) return null;

  const data = removeEmptyFields({
    id: toId(job),

    title: job.title,
    slug: job.slug,

    description: job.description,

    requirements: job.requirements || [],
    benefits: job.benefits || [],

    location: job.location || null,
    type: job.type,

    image: attachmentDTO(job.image),

    applications: mapArray(job.applications, applicationDTO),

    isPublished: job.isPublished,
    isActive: job.isActive,

    createdAt: toDate(job.createdAt),
    updatedAt: toDate(job.updatedAt),
  });

  return jobOutputSchema.parse(data);
}
