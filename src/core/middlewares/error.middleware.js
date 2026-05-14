import { env } from "../../config/env.config.js";

export function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  if (env.nodeEnv === "development") {
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Erro interno do servidor",
  });
}
