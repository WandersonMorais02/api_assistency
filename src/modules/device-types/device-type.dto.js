import { z } from "zod";

import {
  toId,
  toDate,
  removeEmptyFields,
} from "../../core/dtos/base.dto.js";

const deviceTypeOutputSchema = z.object({
  id: z.string(),

  name: z.string(),
  slug: z.string(),

  isActive: z.boolean(),

  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export function deviceTypeDTO(deviceType) {
  if (!deviceType) return null;

  const data = removeEmptyFields({
    id: toId(deviceType),

    name: deviceType.name,
    slug: deviceType.slug,

    isActive: deviceType.isActive,

    createdAt: toDate(deviceType.createdAt),
    updatedAt: toDate(deviceType.updatedAt),
  });

  return deviceTypeOutputSchema.parse(data);
}

export function deviceTypesDTO(deviceTypes = []) {
  return deviceTypes.map(deviceTypeDTO);
}
