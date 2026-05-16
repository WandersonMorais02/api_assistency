import { Router } from "express";

import authRoutes from "../modules/users/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import clientRoutes from "../modules/clients/client.routes.js";
import deviceRoutes from "../modules/devices/device.routes.js";
import deviceTypeRoutes from "../modules/device-types/device-type.routes.js";
import serviceOrderRoutes from "../modules/service-orders/service-order.routes.js";
import attachmentRoutes from "../modules/attachments/attachment.routes.js";
import productRoutes from "../modules/products/product.routes.js";
import jobRoutes from "../modules/jobs/job.routes.js";
import customerPortalRoutes from "../modules/customer-portal/customer-portal.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import productCategoryRoutes from "../modules/product-categories/product-category.routes.js";
import orderRoutes from "../modules/orders/order.routes.js";
import paymentRoutes from "../modules/payments/payment.routes.js";
import companyRoutes from "../modules/company/company.routes.js";
import pdfRoutes from "../modules/pdfs/pdf.routes.js";
import auditLogRoutes from "../modules/audit-logs/audit-log.routes.js";
import chatRoutes from "../modules/internal-chat/chat.routes.js";
import botRoutes from "../modules/bot/bot.routes.js";

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({
    message: "API da assistência técnica rodando",
    status: "online",
  });
});

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/clients", clientRoutes);
routes.use("/devices", deviceRoutes);
routes.use("/device-types", deviceTypeRoutes);
routes.use("/service-orders", serviceOrderRoutes);
routes.use("/attachments", attachmentRoutes);
routes.use("/products", productRoutes);
routes.use("/jobs", jobRoutes);
routes.use("/customer-portal", customerPortalRoutes);
routes.use("/dashboard", dashboardRoutes);
routes.use("/product-categories", productCategoryRoutes);
routes.use("/orders", orderRoutes);
routes.use("/payments", paymentRoutes);
routes.use("/company", companyRoutes);
routes.use("/pdfs", pdfRoutes);
routes.use("/audit-logs", auditLogRoutes);
routes.use("/internal-chat", chatRoutes);
routes.use("/bot", botRoutes);

export default routes;
