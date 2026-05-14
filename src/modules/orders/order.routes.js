import { Router } from "express";

import {
  create,
  index,
  show,
  updateStatus,
  cancel,
} from "./order.controller.js";

import { validate } from "../../core/middlewares/validate.middleware.js";

import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdSchema,
} from "./order.schema.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../users/auth/auth.middleware.js";

const orderRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestão de pedidos
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Criar pedido
 *     tags: [Orders]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - customerName
 *               - customerPhone
 *             properties:
 *               client:
 *                 type: string
 *               customerName:
 *                 type: string
 *                 example: João Silva
 *               customerPhone:
 *                 type: string
 *                 example: 92999999999
 *               customerEmail:
 *                 type: string
 *                 example: joao@email.com
 *               notes:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product
 *                     - quantity
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados inválidos ou estoque insuficiente
 *       404:
 *         description: Produto não encontrado
 */
orderRoutes.post("/", validate(createOrderSchema), create);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Listar pedidos
 *     tags: [Orders]
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
 *           example: PENDING
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           example: PAID
 *       - in: query
 *         name: client
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: João
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
orderRoutes.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "ATTENDANT"),
  index
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     tags: [Orders]
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
 *         description: Pedido encontrado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pedido não encontrado
 */
orderRoutes.get(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(orderIdSchema),
  show
);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Atualizar status do pedido
 *     tags: [Orders]
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
 *                 example: DELIVERED
 *               paymentStatus:
 *                 type: string
 *                 example: PAID
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pedido não encontrado
 */
orderRoutes.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(updateOrderStatusSchema),
  updateStatus
);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancelar pedido
 *     tags: [Orders]
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
 *         description: Pedido cancelado com sucesso
 *       400:
 *         description: Pedido já cancelado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pedido não encontrado
 */
orderRoutes.patch(
  "/:id/cancel",
  authMiddleware,
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(orderIdSchema),
  cancel
);

export default orderRoutes;
