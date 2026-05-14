import { Router } from "express";

import {
  create,
  index,
  show,
  update,
  remove,
} from "./service-order.controller.js";

import {
  createServiceOrderSchema,
  updateServiceOrderSchema,
  serviceOrderIdSchema,
} from "./service-order.schema.js";

import { validate } from "../../core/middlewares/validate.middleware.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../users/auth/auth.middleware.js";

const serviceOrderRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Service Orders
 *   description: Gestão de ordens de serviço
 */

serviceOrderRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/service-orders:
 *   get:
 *     summary: Listar ordens de serviço
 *     tags: [Service Orders]
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
 *         name: status
 *         schema:
 *           type: string
 *           example: IN_ANALYSIS
 *       - in: query
 *         name: client
 *         schema:
 *           type: string
 *       - in: query
 *         name: technician
 *         schema:
 *           type: string
 *       - in: query
 *         name: protocol
 *         schema:
 *           type: string
 *           example: OS-2026-0001
 *     responses:
 *       200:
 *         description: Lista de ordens retornada com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
serviceOrderRoutes.get(
  "/",
  authorizeRoles("ADMIN", "ATTENDANT", "TECHNICIAN"),
  index
);

/**
 * @swagger
 * /api/service-orders:
 *   post:
 *     summary: Criar ordem de serviço
 *     tags: [Service Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client
 *               - device
 *             properties:
 *               client:
 *                 type: string
 *               device:
 *                 type: string
 *               technician:
 *                 type: string
 *               estimatedBudget:
 *                 type: number
 *                 example: 250
 *               diagnosis:
 *                 type: string
 *               technicalReport:
 *                 type: string
 *               observations:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ordem de serviço criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
serviceOrderRoutes.post(
  "/",
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(createServiceOrderSchema),
  create
);

/**
 * @swagger
 * /api/service-orders/{id}:
 *   get:
 *     summary: Buscar ordem de serviço por ID
 *     tags: [Service Orders]
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
 *         description: Ordem de serviço encontrada
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Ordem de serviço não encontrada
 */
serviceOrderRoutes.get(
  "/:id",
  authorizeRoles("ADMIN", "ATTENDANT", "TECHNICIAN"),
  validate(serviceOrderIdSchema),
  show
);

/**
 * @swagger
 * /api/service-orders/{id}:
 *   put:
 *     summary: Atualizar ordem de serviço
 *     tags: [Service Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: IN_REPAIR
 *               technician:
 *                 type: string
 *               estimatedBudget:
 *                 type: number
 *               finalPrice:
 *                 type: number
 *               diagnosis:
 *                 type: string
 *               technicalReport:
 *                 type: string
 *               approvedByClient:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Ordem de serviço atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Ordem de serviço não encontrada
 */
serviceOrderRoutes.put(
  "/:id",
  authorizeRoles("ADMIN", "TECHNICIAN"),
  validate(updateServiceOrderSchema),
  update
);

/**
 * @swagger
 * /api/service-orders/{id}:
 *   delete:
 *     summary: Remover ordem de serviço
 *     tags: [Service Orders]
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
 *         description: Ordem de serviço removida com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Ordem de serviço não encontrada
 */
serviceOrderRoutes.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  validate(serviceOrderIdSchema),
  remove
);

export default serviceOrderRoutes;
