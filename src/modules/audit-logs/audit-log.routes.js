import { Router } from "express";

import { index, show } from "./audit-log.controller.js";

import { validate } from "../../core/middlewares/validate.middleware.js";
import { auditLogIdSchema } from "./audit-log.schema.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../users/auth/auth.middleware.js";

const auditLogRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Audit Logs
 *   description: Logs de auditoria do sistema
 */

auditLogRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     summary: Listar logs de auditoria
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           example: CREATE_PRODUCT
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *       - in: query
 *         name: module
 *         schema:
 *           type: string
 *           example: PRODUCTS
 *     responses:
 *       200:
 *         description: Lista de logs retornada com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
auditLogRoutes.get(
  "/",
  authorizeRoles("ADMIN"),
  index
);

/**
 * @swagger
 * /api/audit-logs/{id}:
 *   get:
 *     summary: Buscar log de auditoria por ID
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Log encontrado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Log não encontrado
 */
auditLogRoutes.get(
  "/:id",
  authorizeRoles("ADMIN"),
  validate(auditLogIdSchema),
  show
);

export default auditLogRoutes;
