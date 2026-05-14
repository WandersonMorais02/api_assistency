import { Router } from "express";

import {
  create,
  index,
  show,
  update,
  remove,
} from "./device.controller.js";

import { validate } from "../../core/middlewares/validate.middleware.js";

import {
  createDeviceSchema,
  updateDeviceSchema,
  deviceIdSchema,
} from "./device.schema.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../users/auth/auth.middleware.js";

const deviceRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: Gestão de equipamentos
 */

deviceRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Listar equipamentos
 *     tags: [Devices]
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
 *         name: client
 *         schema:
 *           type: string
 *       - in: query
 *         name: deviceType
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: iphone
 *     responses:
 *       200:
 *         description: Lista de equipamentos retornada com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
deviceRoutes.get(
  "/",
  authorizeRoles("ADMIN", "ATTENDANT", "TECHNICIAN"),
  index
);

/**
 * @swagger
 * /api/devices:
 *   post:
 *     summary: Criar equipamento
 *     tags: [Devices]
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
 *               - deviceType
 *               - brand
 *               - model
 *             properties:
 *               client:
 *                 type: string
 *               deviceType:
 *                 type: string
 *               brand:
 *                 type: string
 *                 example: Apple
 *               model:
 *                 type: string
 *                 example: iPhone 13
 *               serialNumber:
 *                 type: string
 *               imei:
 *                 type: string
 *               color:
 *                 type: string
 *               accessories:
 *                 type: string
 *               reportedIssue:
 *                 type: string
 *               physicalCondition:
 *                 type: string
 *               observations:
 *                 type: string
 *     responses:
 *       201:
 *         description: Equipamento criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
deviceRoutes.post(
  "/",
  authorizeRoles("ADMIN", "ATTENDANT", "TECHNICIAN"),
  validate(createDeviceSchema),
  create
);

/**
 * @swagger
 * /api/devices/{id}:
 *   get:
 *     summary: Buscar equipamento por ID
 *     tags: [Devices]
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
 *         description: Equipamento encontrado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Equipamento não encontrado
 */
deviceRoutes.get(
  "/:id",
  authorizeRoles("ADMIN", "ATTENDANT", "TECHNICIAN"),
  validate(deviceIdSchema),
  show
);

/**
 * @swagger
 * /api/devices/{id}:
 *   put:
 *     summary: Atualizar equipamento
 *     tags: [Devices]
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
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               serialNumber:
 *                 type: string
 *               imei:
 *                 type: string
 *               color:
 *                 type: string
 *               accessories:
 *                 type: string
 *               reportedIssue:
 *                 type: string
 *               physicalCondition:
 *                 type: string
 *               observations:
 *                 type: string
 *     responses:
 *       200:
 *         description: Equipamento atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Equipamento não encontrado
 */
deviceRoutes.put(
  "/:id",
  authorizeRoles("ADMIN", "ATTENDANT", "TECHNICIAN"),
  validate(updateDeviceSchema),
  update
);

/**
 * @swagger
 * /api/devices/{id}:
 *   delete:
 *     summary: Remover equipamento
 *     tags: [Devices]
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
 *         description: Equipamento removido com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Equipamento não encontrado
 */
deviceRoutes.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  validate(deviceIdSchema),
  remove
);

export default deviceRoutes;
