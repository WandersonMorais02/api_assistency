import { z } from "zod";

import {
  toId,
  toDate,
  mapArray,
  removeEmptyFields,
} from "../../core/dtos/base.dto.js";

const simpleClientSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
});

const simpleDeviceTypeSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  slug: z.string().optional(),
});

const simpleAttachmentSchema = z.object({
  id: z.string(),
  url: z.string().optional(),
  mimetype: z.string().optional(),
  category: z.string().optional(),
  context: z.string().optional(),
});

const deviceOutputSchema = z.object({
  id: z.string(),

  client: simpleClientSchema.nullable().optional(),
  deviceType: simpleDeviceTypeSchema.nullable().optional(),

  brand: z.string(),
  model: z.string(),

  serialNumber: z.string().nullable().optional(),
  imei: z.string().nullable().optional(),
  color: z.string().nullable().optional(),

  accessories: z.array(z.string()).optional(),

  reportedIssue: z.string(),
  physicalCondition: z.string().nullable().optional(),
  passwordOrPattern: z.string().nullable().optional(),
  observations: z.string().nullable().optional(),

  images: z.array(simpleAttachmentSchema).optional(),

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

function simpleAttachmentDTO(attachment) {
  if (!attachment) return null;

  return removeEmptyFields({
    id: toId(attachment),
    url: attachment.url,
    mimetype: attachment.mimetype,
    category: attachment.category,
    context: attachment.context,
  });
}

export function deviceDTO(device) {
  if (!device) return null;

  const data = removeEmptyFields({
    id: toId(device),

    client: simpleClientDTO(device.client),
    deviceType: simpleDeviceTypeDTO(device.deviceType),

    brand: device.brand,
    model: device.model,

    serialNumber: device.serialNumber || null,
    imei: device.imei || null,
    color: device.color || null,

    accessories: device.accessories || [],

    reportedIssue: device.reportedIssue,
    physicalCondition: device.physicalCondition || null,
    passwordOrPattern: device.passwordOrPattern || null,
    observations: device.observations || null,

    images: mapArray(device.images, simpleAttachmentDTO),

    isActive: device.isActive,

    createdAt: toDate(device.createdAt),
    updatedAt: toDate(device.updatedAt),
  });

  return deviceOutputSchema.parse(data);
}
