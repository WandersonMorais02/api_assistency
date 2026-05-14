import { z } from "zod";

import {
  toId,
  toDate,
  removeEmptyFields,
} from "../../core/dtos/base.dto.js";

const performedBySchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    email: z.string().nullable().optional(),
    role: z.string().optional(),
  })
  .nullable()
  .optional();

const auditLogOutputSchema = z.object({
  id: z.string(),

  action: z.string(),
  entity: z.string(),
  entityId: z.string().nullable().optional(),

  performedBy: performedBySchema,

  changes: z.any().optional(),
  metadata: z.any().optional(),

  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

function performedByDTO(user) {
  if (!user) return null;

  return removeEmptyFields({
    id: toId(user),
    name: user.name,
    email: user.email || null,
    role: user.role,
  });
}

export function auditLogDTO(log) {
  if (!log) return null;

  const data = removeEmptyFields({
    id: toId(log),

    action: log.action,
    entity: log.entity,
    entityId: log.entityId ? toId(log.entityId) : null,

    performedBy: performedByDTO(log.performedBy),

    changes: log.changes || {},
    metadata: log.metadata || {},

    createdAt: toDate(log.createdAt),
    updatedAt: toDate(log.updatedAt),
  });

  return auditLogOutputSchema.parse(data);
}
