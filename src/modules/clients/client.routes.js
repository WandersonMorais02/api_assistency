import { Router } from "express";

import {
  create,
  index,
  show,
  update,
  remove,
} from "./client.controller.js";

import { validate } from "../../core/middlewares/validate.middleware.js";

import {
  createClientSchema,
  updateClientSchema,
  clientIdSchema,
} from "./client.schema.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../users/auth/auth.middleware.js";

const clientRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Gestão de clientes
 */

clientRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Listar clientes
 *     tags: [Clients]
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
 *         name: search
 *         schema:
 *           type: string
 *           example: joão
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
clientRoutes.get(
  "/",
  authorizeRoles("ADMIN", "ATTENDANT", "TECHNICIAN"),
  index
);

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Criar cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               phone:
 *                 type: string
 *                 example: 92999999999
 *               cpf:
 *                 type: string
 *                 example: 00000000000
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
clientRoutes.post(
  "/",
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(createClientSchema),
  create
);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Buscar cliente por ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Cliente não encontrado
 */
clientRoutes.get(
  "/:id",
  authorizeRoles("ADMIN", "ATTENDANT", "TECHNICIAN"),
  validate(clientIdSchema),
  show
);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Atualizar cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               cpf:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Cliente não encontrado
 */
clientRoutes.put(
  "/:id",
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(updateClientSchema),
  update
);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Remover cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente removido com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Cliente não encontrado
 */
clientRoutes.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  validate(clientIdSchema),
  remove
);

export default clientRoutes;
