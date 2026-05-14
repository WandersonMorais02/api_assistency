import routes from "../routes/index.routes.js";

export function setupRoutes(app) {
  app.use("/api", routes);
}
