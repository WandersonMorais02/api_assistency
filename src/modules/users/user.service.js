import { User } from "./user.model.js";
import { userDTO } from "./user.dto.js";

import { createAuditLog } from "../audit-logs/audit-log.service.js";

import { AppError } from "../../core/errors/app-error.js";

import {
  getPaginationParams,
  buildPaginationResponse,
} from "../../core/utils/pagination.js";

import { paginatedDTO } from "../../core/dtos/paginated.dto.js";

export async function listUsers(query = {}) {
  const { page, limit, skip } = getPaginationParams(query);

  const filter = {};

  if (query.search) {
    filter.$or = [
      { name: new RegExp(query.search, "i") },
      { email: new RegExp(query.search, "i") },
      { role: new RegExp(query.search, "i") },
    ];
  }

  if (query.role) {
    filter.role = query.role;
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true";
  }

  const [data, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    User.countDocuments(filter),
  ]);

  const result = buildPaginationResponse({
    data,
    total,
    page,
    limit,
  });

  return paginatedDTO(result, userDTO);
}

export async function findUserById(id) {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  return userDTO(user);
}

export async function updateUserRole(id, role, performedBy) {
  const currentUser = await User.findById(id).select("-password");

  if (!currentUser) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const oldRole = currentUser.role;

  currentUser.role = role;

  await currentUser.save();

  await createAuditLog({
    action: "USER_ROLE_UPDATED",
    entity: "User",
    entityId: currentUser._id,
    performedBy,
    changes: {
      role: {
        from: oldRole,
        to: currentUser.role,
      },
    },
    metadata: {
      targetUserName: currentUser.name,
      targetUserEmail: currentUser.email,
    },
  });

  return userDTO(currentUser);
}
