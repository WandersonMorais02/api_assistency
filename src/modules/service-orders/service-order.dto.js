import { z } from "zod";

import {
  toId,
  toDate,
  mapArray,
  removeEmptyFields,
} from "../../core/dtos/base.dto.js";

const simpleClientSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    phone: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    cpf: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

const simpleDeviceTypeSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    slug: z.string().optional(),
  })
  .nullable()
  .optional();

const simpleDeviceSchema = z
  .object({
    id: z.string(),
    brand: z.string().optional(),
    model: z.string().optional(),
    deviceType: simpleDeviceTypeSchema,
  })
  .nullable()
  .optional();

const simpleUserSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    email: z.string().nullable().optional(),
    role: z.string().optional(),
  })
  .nullable()
  .optional();

const simpleAttachmentSchema = z.object({
  id: z.string(),
  originalName: z.string().optional(),
  url: z.string().optional(),
  mimetype: z.string().optional(),
  category: z.string().optional(),
  context: z.string().optional(),
  createdAt: z.string().nullable().optional(),
});

const timelineSchema = z.object({
  id: z.string().nullable().optional(),
  status: z.string(),
  message: z.string(),
  createdBy: simpleUserSchema,
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

const serviceOrderOutputSchema = z.object({
  id: z.string(),
  protocol: z.string(),

  client: simpleClientSchema,
  device: simpleDeviceSchema,
  technician: simpleUserSchema,

  status: z.string(),

  estimatedBudget: z.number(),
  finalPrice: z.number(),
  approvedByClient: z.boolean(),

  diagnosis: z.string().nullable().optional(),
  technicalReport: z.string().nullable().optional(),
  internalNotes: z.string().nullable().optional(),

  attachments: z.array(simpleAttachmentSchema).optional(),
  timeline: z.array(timelineSchema).optional(),

  deliveredAt: z.string().nullable().optional(),
  canceledAt: z.string().nullable().optional(),

  isActive: z.boolean(),

  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

function simpleClientDTO(client) {
  if (!client) return null;

  return removeEmptyFields({
    id: toId(client),
    name: client.name,
    phone: client.phone || null,
    email: client.email || null,
    cpf: client.cpf || null,
  });
}

function simpleDeviceTypeDTO(deviceType) {
  if (!deviceType) return null;

  return removeEmptyFields({
    id: toId(deviceType),
    name: deviceType.name,
    slug: deviceType.slug,
  });
}

function simpleDeviceDTO(device) {
  if (!device) return null;

  return removeEmptyFields({
    id: toId(device),
    brand: device.brand,
    model: device.model,
    deviceType: simpleDeviceTypeDTO(device.deviceType),
  });
}

function simpleUserDTO(user) {
  if (!user) return null;

  return removeEmptyFields({
    id: toId(user),
    name: user.name,
    email: user.email || null,
    role: user.role,
  });
}

function simpleAttachmentDTO(attachment) {
  if (!attachment) return null;

  return removeEmptyFields({
    id: toId(attachment),
    originalName: attachment.originalName,
    url: attachment.url,
    mimetype: attachment.mimetype,
    category: attachment.category,
    context: attachment.context,
    createdAt: toDate(attachment.createdAt),
  });
}

function timelineDTO(item) {
  if (!item) return null;

  return removeEmptyFields({
    id: item._id ? toId(item) : null,
    status: item.status,
    message: item.message,
    createdBy: simpleUserDTO(item.createdBy),
    createdAt: toDate(item.createdAt),
    updatedAt: toDate(item.updatedAt),
  });
}

export function serviceOrderDTO(serviceOrder) {
  if (!serviceOrder) return null;

  const data = removeEmptyFields({
    id: toId(serviceOrder),
    protocol: serviceOrder.protocol,

    client: simpleClientDTO(serviceOrder.client),
    device: simpleDeviceDTO(serviceOrder.device),
    technician: simpleUserDTO(serviceOrder.technician),

    status: serviceOrder.status,

    estimatedBudget: serviceOrder.estimatedBudget ?? 0,
    finalPrice: serviceOrder.finalPrice ?? 0,
    approvedByClient: serviceOrder.approvedByClient ?? false,

    diagnosis: serviceOrder.diagnosis || null,
    technicalReport: serviceOrder.technicalReport || null,
    internalNotes: serviceOrder.internalNotes || null,

    attachments: mapArray(serviceOrder.attachments, simpleAttachmentDTO),
    timeline: mapArray(serviceOrder.timeline, timelineDTO),

    deliveredAt: toDate(serviceOrder.deliveredAt),
    canceledAt: toDate(serviceOrder.canceledAt),

    isActive: serviceOrder.isActive,

    createdAt: toDate(serviceOrder.createdAt),
    updatedAt: toDate(serviceOrder.updatedAt),
  });

  return serviceOrderOutputSchema.parse(data);
}
