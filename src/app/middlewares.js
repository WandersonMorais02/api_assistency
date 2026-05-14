import cors from "cors";
import express from "express";

import { env } from "../config/env.config.js";

function normalizeOrigins(origins) {
  if (!origins) return [];

  if (Array.isArray(origins)) {
    return origins;
  }

  return origins
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);
}

export function setupMiddlewares(app) {
  /*
  |--------------------------------------------------------------------------
  | CORS
  |--------------------------------------------------------------------------
  */

  const allowedOrigins = normalizeOrigins(
    env.corsOrigin
  );

  app.use(
    cors({
      origin(origin, callback) {
        /*
        |--------------------------------------------------------------------------
        | REQUESTS SEM ORIGIN
        | POSTMAN / MOBILE / CURL
        |--------------------------------------------------------------------------
        */

        if (!origin) {
          return callback(null, true);
        }

        /*
        |--------------------------------------------------------------------------
        | ALLOWED ORIGINS
        |--------------------------------------------------------------------------
        */

        if (
          allowedOrigins.includes("*") ||
          allowedOrigins.includes(origin)
        ) {
          return callback(null, true);
        }

        return callback(
          new Error("Origin não permitida pelo CORS")
        );
      },

      credentials: true,

      methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
      ],

      allowedHeaders: [
        "Content-Type",
        "Authorization",
      ],
    })
  );

  /*
  |--------------------------------------------------------------------------
  | BODY PARSERS
  |--------------------------------------------------------------------------
  */

  app.use(
    express.json({
      limit: "10mb",
    })
  );

  app.use(
    express.urlencoded({
      extended: true,
      limit: "10mb",
    })
  );
}
