import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import { env } from "../config/env.config.js";

const swaggerDefinition = {
  openapi: "3.0.0",

  info: {
    title: "Assistência Técnica API",
    version: "1.0.0",
    description:
      "API para gestão de assistência técnica, ordens de serviço, clientes, produtos, pagamentos, vagas e portal do cliente.",
  },

  servers: [
    {
      url: env.appUrl,
      description: "Servidor principal",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  definition: swaggerDefinition,

  apis: [
    "./src/routes/*.js",
    "./src/modules/**/*.routes.js",
  ],
};

export const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "Assistência Técnica API Docs",
    })
  );

  app.get("/api/docs.json", (req, res) => {
    return res.json(swaggerSpec);
  });
}
