import bcrypt from "bcryptjs";

import { User } from "../user.model.js";
import { authDTO } from "./auth.dto.js";

import { createAuditLog } from "../../audit-logs/audit-log.service.js";

import { AppError } from "../../../core/errors/app-error.js";
import { generateToken } from "../../../core/utils/generate-token.js";

export async function registerUser({
  name,
  email,
  password,
}) {
  const emailAlreadyExists = await User.findOne({
    email,
  });

  if (emailAlreadyExists) {
    throw new AppError(
      "Este e-mail já está em uso",
      409
    );
  }

  const usersCount = await User.countDocuments();

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: usersCount === 0 ? "ADMIN" : "CLIENT",
  });

  await createAuditLog({
    action: "USER_REGISTERED",
    entity: "User",
    entityId: user._id,
    performedBy: user._id,
    changes: {
      role: {
        from: null,
        to: user.role,
      },
      isActive: {
        from: null,
        to: user.isActive,
      },
    },
    metadata: {
      name: user.name,
      email: user.email,
      firstUser: usersCount === 0,
    },
  });

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  return authDTO({
    user,
    token,
  });
}

export async function loginUser({
  email,
  password,
}) {
  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw new AppError(
      "E-mail ou senha inválidos",
      401
    );
  }

  if (!user.isActive) {
    throw new AppError(
      "Usuário inativo",
      403
    );
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatches) {
    throw new AppError(
      "E-mail ou senha inválidos",
      401
    );
  }

  await createAuditLog({
    action: "USER_LOGGED_IN",
    entity: "User",
    entityId: user._id,
    performedBy: user._id,
    changes: {},
    metadata: {
      email: user.email,
      role: user.role,
    },
  });

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  return authDTO({
    user,
    token,
  });
}
