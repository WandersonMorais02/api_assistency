import { AuditLog } from "./audit-log.model.js";
import { auditLogDTO } from "./audit-log.dto.js";

import { AppError } from "../../core/errors/app-error.js";

import {
  getPaginationParams,
  buildPaginationResponse,
} from "../../core/utils/pagination.js";

import { paginatedDTO } from "../../core/dtos/paginated.dto.js";

export async function createAuditLog({
  action,
  entity,
  entityId,
  performedBy,
  changes = {},
  metadata = {},
}) {
  return AuditLog.create({
    action,
    entity,
    entityId,
    performedBy,
    changes,
    metadata,
  });
}

export async function listAuditLogs(query = {}) {
  const { page, limit, skip } = getPaginationParams(query);

  const filter = {};

  if (query.action) {
    filter.action = query.action;
  }

  if (query.entity) {
    filter.entity = query.entity;
  }

  if (query.entityId) {
    filter.entityId = query.entityId;
  }

  if (query.performedBy) {
    filter.performedBy = query.performedBy;
  }

  const [data, total] = await Promise.all([
    AuditLog.find(filter)
      .populate("performedBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    AuditLog.countDocuments(filter),
  ]);

  const result = buildPaginationResponse({
    data,
    total,
    page,
    limit,
  });

  return paginatedDTO(result, auditLogDTO);
}

export async function findAuditLogById(id) {
  const log = await AuditLog.findById(id).populate(
    "performedBy",
    "name email role"
  );

  if (!log) {
    throw new AppError("Log de auditoria não encontrado", 404);
  }

  return auditLogDTO(log);
}
