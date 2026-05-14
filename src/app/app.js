import express from "express";

import { setupSecurity } from "./security.js";
import { setupMiddlewares } from "./middlewares.js";
import { setupStaticFiles } from "./static.js";
import { setupRoutes } from "./routes.js";
import { setupSwagger } from "./swagger.js";

import { loggerMiddleware } from "./logger.js";

import { errorMiddleware } from "../core/middlewares/error.middleware.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  setupSecurity(app);
  setupMiddlewares(app);

  app.use(loggerMiddleware);

  setupStaticFiles(app);
  setupRoutes(app);
  setupSwagger(app);

  app.use(errorMiddleware);

  return app;
}
