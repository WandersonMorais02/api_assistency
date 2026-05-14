import jwt from "jsonwebtoken";

import { env } from "../../../config/env.config.js";
import { AppError } from "../../../core/errors/app-error.js";
import { User } from "../user.model.js";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token não informado", 401);
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      throw new AppError("Token inválido", 401);
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError("Usuário não encontrado", 401);
    }

    if (!user.isActive) {
      throw new AppError("Usuário inativo", 403);
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Usuário não autenticado", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Acesso negado", 403));
    }

    return next();
  };
}
