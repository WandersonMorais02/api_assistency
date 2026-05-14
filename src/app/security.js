import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";

import { env } from "../config/env.config.js";

export function setupSecurity(app) {
  /*
  |--------------------------------------------------------------------------
  | HELMET
  |--------------------------------------------------------------------------
  */

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );

  /*
  |--------------------------------------------------------------------------
  | COMPRESSION
  |--------------------------------------------------------------------------
  */

  app.use(compression());

  /*
  |--------------------------------------------------------------------------
  | GLOBAL RATE LIMIT
  |--------------------------------------------------------------------------
  */

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,

      limit:
        env.nodeEnv === "production"
          ? 300
          : 999999,

      standardHeaders: true,
      legacyHeaders: false,

      message: {
        success: false,
        message:
          "Muitas requisições. Tente novamente em alguns minutos.",
      },
    })
  );

  /*
  |--------------------------------------------------------------------------
  | AUTH RATE LIMIT
  |--------------------------------------------------------------------------
  */

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 20,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Muitas tentativas de autenticação. Aguarde alguns minutos.",
    },
  });

  app.use("/api/auth", authLimiter);

  /*
  |--------------------------------------------------------------------------
  | JSON LIMIT
  |--------------------------------------------------------------------------
  */

  app.use((req, res, next) => {
    res.removeHeader("X-Powered-By");
    next();
  });
}
