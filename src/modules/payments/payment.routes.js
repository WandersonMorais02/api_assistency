import { Router } from "express";

import {
  create,
  index,
  show,
  update,
  remove,
} from "./payment.controller.js";

import { validate } from "../../core/middlewares/validate.middleware.js";

import {
  createPaymentSchema,
  updatePaymentSchema,
  paymentIdSchema,
} from "./payment.schema.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../users/auth/auth.middleware.js";

const paymentRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Gestão de pagamentos
 */

paymentRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Listar pagamentos
 *     tags: [Payments]
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
 *         name: context
 *         schema:
 *           type: string
 *           example: ORDER
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: PAID
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *           example: PIX
 *       - in: query
 *         name: relatedTo
 *         schema:
 *           type: string
 *       - in: query
 *         name: receivedBy
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pagamentos retornada com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
paymentRoutes.get(
  "/",
  authorizeRoles("ADMIN", "ATTENDANT"),
  index
);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Criar pagamento
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - context
 *               - relatedTo
 *               - amount
 *               - method
 *             properties:
 *               context:
 *                 type: string
 *                 example: ORDER
 *               relatedTo:
 *                 type: string
 *               amount:
 *                 type: number
 *                 example: 250
 *               method:
 *                 type: string
 *                 example: PIX
 *               status:
 *                 type: string
 *                 example: PAID
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pagamento criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Entidade relacionada não encontrada
 */
paymentRoutes.post(
  "/",
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(createPaymentSchema),
  create
);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Buscar pagamento por ID
 *     tags: [Payments]
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
 *         description: Pagamento encontrado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pagamento não encontrado
 */
paymentRoutes.get(
  "/:id",
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(paymentIdSchema),
  show
);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Atualizar pagamento
 *     tags: [Payments]
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
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *               status:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pagamento atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pagamento não encontrado
 */
paymentRoutes.put(
  "/:id",
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(updatePaymentSchema),
  update
);

/**
 * @swagger
 * /api/payments/{id}:
 *   delete:
 *     summary: Cancelar/remover pagamento
 *     tags: [Payments]
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
 *         description: Pagamento removido com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pagamento não encontrado
 */
paymentRoutes.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  validate(paymentIdSchema),
  remove
);

export default paymentRoutes;
