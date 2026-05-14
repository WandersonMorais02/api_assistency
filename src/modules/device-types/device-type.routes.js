import { Router } from "express";

import {
  create,
  index,
  show,
  update,
  remove,
} from "./device-type.controller.js";

import { validate } from "../../core/middlewares/validate.middleware.js";

import {
  createDeviceTypeSchema,
  updateDeviceTypeSchema,
  deviceTypeIdSchema,
} from "./device-type.schema.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../users/auth/auth.middleware.js";

const deviceTypeRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Device Types
 *   description: Gestão de tipos de equipamentos
 */

deviceTypeRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/device-types:
 *   get:
 *     summary: Listar tipos de equipamentos
 *     tags: [Device Types]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
deviceTypeRoutes.get(
  "/",
  authorizeRoles("ADMIN", "ATTENDANT", "TECHNICIAN"),
  index
);

/**
 * @swagger
 * /api/device-types:
 *   post:
 *     summary: Criar tipo de equipamento
 *     tags: [Device Types]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Smartphone
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Tipo criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       409:
 *         description: Tipo já cadastrado
 */
deviceTypeRoutes.post(
  "/",
  authorizeRoles("ADMIN"),
  validate(createDeviceTypeSchema),
  create
);

/**
 * @swagger
 * /api/device-types/{id}:
 *   get:
 *     summary: Buscar tipo de equipamento por ID
 *     tags: [Device Types]
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
 *         description: Tipo encontrado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Tipo não encontrado
 */
deviceTypeRoutes.get(
  "/:id",
  authorizeRoles("ADMIN", "ATTENDANT", "TECHNICIAN"),
  validate(deviceTypeIdSchema),
  show
);

/**
 * @swagger
 * /api/device-types/{id}:
 *   put:
 *     summary: Atualizar tipo de equipamento
 *     tags: [Device Types]
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
 *               name:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tipo atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Tipo não encontrado
 */
deviceTypeRoutes.put(
  "/:id",
  authorizeRoles("ADMIN"),
  validate(updateDeviceTypeSchema),
  update
);

/**
 * @swagger
 * /api/device-types/{id}:
 *   delete:
 *     summary: Remover tipo de equipamento
 *     tags: [Device Types]
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
 *         description: Tipo removido com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Tipo não encontrado
 */
deviceTypeRoutes.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  validate(deviceTypeIdSchema),
  remove
);

export default deviceTypeRoutes;
