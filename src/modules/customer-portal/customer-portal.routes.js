import { Router } from "express";

import {
  showServiceOrderByProtocol,
  approveBudget,
} from "./customer-portal.controller.js";

import { validate } from "../../core/middlewares/validate.middleware.js";

import {
  protocolSchema,
  approveBudgetSchema,
} from "./customer-portal.schema.js";

const customerPortalRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Customer Portal
 *   description: Portal público do cliente
 */

/**
 * @swagger
 * /api/customer-portal/service-orders/{protocol}:
 *   get:
 *     summary: Consultar ordem de serviço por protocolo
 *     tags: [Customer Portal]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: protocol
 *         required: true
 *         schema:
 *           type: string
 *         example: OS-2026-0001
 *     responses:
 *       200:
 *         description: Ordem de serviço encontrada
 *       404:
 *         description: Protocolo não encontrado
 */
customerPortalRoutes.get(
  "/service-orders/:protocol",
  validate(protocolSchema),
  showServiceOrderByProtocol
);

/**
 * @swagger
 * /api/customer-portal/service-orders/{protocol}/approve-budget:
 *   patch:
 *     summary: Aprovar ou recusar orçamento
 *     tags: [Customer Portal]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: protocol
 *         required: true
 *         schema:
 *           type: string
 *         example: OS-2026-0001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approved
 *             properties:
 *               approved:
 *                 type: boolean
 *                 example: true
 *               customerNote:
 *                 type: string
 *                 example: Pode prosseguir com o reparo
 *     responses:
 *       200:
 *         description: Resposta do orçamento registrada com sucesso
 *       400:
 *         description: Ordem não está aguardando aprovação
 *       404:
 *         description: Protocolo não encontrado
 */
customerPortalRoutes.patch(
  "/service-orders/:protocol/approve-budget",
  validate(approveBudgetSchema),
  approveBudget
);

export default customerPortalRoutes;
