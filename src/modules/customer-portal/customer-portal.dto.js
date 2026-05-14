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
  })
  .nullable()
  .optional();

const deviceTypeSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    slug: z.string().optional(),
  })
  .nullable()
  .optional();

const attachmentSchema = z.object({
  id: z.string(),
  originalName: z.string().nullable().optional(),
  url: z.string().optional(),
  mimetype: z.string().optional(),
  category: z.string().optional(),
  context: z.string().optional(),
  createdAt: z.string().nullable().optional(),
});

const deviceSchema = z
  .object({
    id: z.string(),

    deviceType: deviceTypeSchema,

    brand: z.string().optional(),
    model: z.string().optional(),

    serialNumber: z.string().nullable().optional(),
    imei: z.string().nullable().optional(),
    color: z.string().nullable().optional(),

    accessories: z.array(z.string()).optional(),

    reportedIssue: z.string().optional(),
    physicalCondition: z.string().nullable().optional(),
    observations: z.string().nullable().optional(),

    images: z.array(attachmentSchema).optional(),
  })
  .nullable()
  .optional();

const technicianSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    role: z.string().optional(),
  })
  .nullable()
  .optional();

const timelineSchema = z.object({
  id: z.string().nullable().optional(),
  status: z.string(),
  message: z.string(),
  createdBy: technicianSchema,
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

const customerPortalServiceOrderSchema = z.object({
  protocol: z.string(),
  status: z.string(),

  client: clientSchema,
  device: deviceSchema,
  technician: technicianSchema,

  estimatedBudget: z.number(),
  finalPrice: z.number(),
  approvedByClient: z.boolean(),

  diagnosis: z.string().nullable().optional(),
  technicalReport: z.string().nullable().optional(),

  attachments: z.array(attachmentSchema).optional(),
  timeline: z.array(timelineSchema).optional(),

  deliveredAt: z.string().nullable().optional(),
  canceledAt: z.string().nullable().optional(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

function clientDTO(client) {
  if (!client) return null;

  return removeEmptyFields({
    id: toId(client),
    name: client.name,
    phone: client.phone || null,
  });
}

function deviceTypeDTO(deviceType) {
  if (!deviceType) return null;

  return removeEmptyFields({
    id: toId(deviceType),
    name: deviceType.name,
    slug: deviceType.slug,
  });
}

function attachmentDTO(attachment) {
  if (!attachment) return null;

  return removeEmptyFields({
    id: toId(attachment),
    originalName: attachment.originalName || null,
    url: attachment.url,
    mimetype: attachment.mimetype,
    category: attachment.category,
    context: attachment.context,
    createdAt: toDate(attachment.createdAt),
  });
}

function deviceDTO(device) {
  if (!device) return null;

  return removeEmptyFields({
    id: toId(device),

    deviceType: deviceTypeDTO(device.deviceType),

    brand: device.brand,
    model: device.model,

    serialNumber: device.serialNumber || null,
    imei: device.imei || null,
    color: device.color || null,

    accessories: device.accessories || [],

    reportedIssue: device.reportedIssue,
    physicalCondition: device.physicalCondition || null,
    observations: device.observations || null,

    images: mapArray(device.images, attachmentDTO),
  });
}

function technicianDTO(user) {
  if (!user) return null;

  return removeEmptyFields({
    id: toId(user),
    name: user.name,
    role: user.role,
  });
}

function timelineDTO(item) {
  if (!item) return null;

  return removeEmptyFields({
    id: item._id ? toId(item) : null,
    status: item.status,
    message: item.message,
    createdBy: technicianDTO(item.createdBy),
    createdAt: toDate(item.createdAt),
    updatedAt: toDate(item.updatedAt),
  });
}

export function customerPortalServiceOrderDTO(serviceOrder) {
  if (!serviceOrder) return null;

  const data = removeEmptyFields({
    protocol: serviceOrder.protocol,
    status: serviceOrder.status,

    client: clientDTO(serviceOrder.client),
    device: deviceDTO(serviceOrder.device),
    technician: technicianDTO(serviceOrder.technician),

    estimatedBudget: serviceOrder.estimatedBudget ?? 0,
    finalPrice: serviceOrder.finalPrice ?? 0,
    approvedByClient: serviceOrder.approvedByClient ?? false,

    diagnosis: serviceOrder.diagnosis || null,
    technicalReport: serviceOrder.technicalReport || null,

    attachments: mapArray(serviceOrder.attachments, attachmentDTO),
    timeline: mapArray(serviceOrder.timeline, timelineDTO),

    deliveredAt: toDate(serviceOrder.deliveredAt),
    canceledAt: toDate(serviceOrder.canceledAt),
    createdAt: toDate(serviceOrder.createdAt),
    updatedAt: toDate(serviceOrder.updatedAt),
  });

  return customerPortalServiceOrderSchema.parse(data);
}
