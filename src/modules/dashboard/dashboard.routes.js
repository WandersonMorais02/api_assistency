import { Router } from "express";

import { summary } from "./dashboard.controller.js";

import {
  authMiddleware,
 authorizeRoles,
} from "../users/auth/auth.middleware.js";

const dashboardRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Métricas e indicadores do sistema
 */

dashboardRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Resumo geral do dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo retornado com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
dashboardRoutes.get(
  "/summary",
  authorizeRoles("ADMIN", "ATTENDANT", "TECHNICIAN"),
  summary
);

export default dashboardRoutes;
