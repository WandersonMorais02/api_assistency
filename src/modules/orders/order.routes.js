import { Router } from "express";

import {
  create,
  checkout,
  index,
  show,
  updateStatus,
  cancel,
  mercadoPagoWebhook,
} from "./order.controller.js";

import { validate } from "../../core/middlewares/validate.middleware.js";

import {
  createOrderSchema,
  createCheckoutOrderSchema,
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
 *     summary: Criar pedido manual
 *     tags: [Orders]
 *     security: []
 */
orderRoutes.post("/", validate(createOrderSchema), create);

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Criar pedido e gerar checkout Mercado Pago
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
 *               - customerEmail
 *               - shippingAddress
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: João Silva
 *               customerPhone:
 *                 type: string
 *                 example: "92999999999"
 *               customerEmail:
 *                 type: string
 *                 example: joao@email.com
 *               notes:
 *                 type: string
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - zipCode
 *                   - street
 *                   - number
 *                   - neighborhood
 *                   - city
 *                   - state
 *                 properties:
 *                   zipCode:
 *                     type: string
 *                     example: "69000000"
 *                   street:
 *                     type: string
 *                     example: Rua Exemplo
 *                   number:
 *                     type: string
 *                     example: "123"
 *                   complement:
 *                     type: string
 *                     example: Casa
 *                   neighborhood:
 *                     type: string
 *                     example: Centro
 *                   city:
 *                     type: string
 *                     example: Manaus
 *                   state:
 *                     type: string
 *                     example: AM
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
 *                       example: 1
 *     responses:
 *       201:
 *         description: Pedido criado e preferência Mercado Pago gerada
 *       400:
 *         description: Dados inválidos ou estoque insuficiente
 *       404:
 *         description: Produto não encontrado
 */
orderRoutes.post(
  "/checkout",
  validate(createCheckoutOrderSchema),
  checkout
);

/**
 * @swagger
 * /api/orders/mercado-pago/webhook:
 *   post:
 *     summary: Webhook Mercado Pago para atualizar pagamento do pedido
 *     tags: [Orders]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           example: payment
 *       - in: query
 *         name: data.id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Webhook recebido
 */
orderRoutes.post("/mercado-pago/webhook", mercadoPagoWebhook);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Listar pedidos
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
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
 */
orderRoutes.patch(
  "/:id/cancel",
  authMiddleware,
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(orderIdSchema),
  cancel
);

export default orderRoutes;
