import express from "express";

export function setupStaticFiles(app) {
  app.use(
    "/uploads",
    (req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    },
    express.static("uploads")
  );
}
