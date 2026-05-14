import express from "express";

export function setupStaticFiles(app) {
  app.use("/uploads", express.static("uploads"));
}
