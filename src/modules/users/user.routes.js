import { Router } from "express";

import { index, show, updateRole } from "./user.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "./auth/auth.middleware.js";

import { validate } from "../../core/middlewares/validate.middleware.js";
import { updateUserRoleSchema } from "./user.schema.js";

const userRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestão de usuários do sistema
 */

userRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar usuários
 *     tags: [Users]
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
 *           example: saulo
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           example: ADMIN
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *           example: true
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso negado
 */
userRoutes.get("/", authorizeRoles("ADMIN"), index);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.get("/:id", authorizeRoles("ADMIN"), show);

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Atualizar cargo/permissão do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 example: TECHNICIAN
 *     responses:
 *       200:
 *         description: Cargo atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.patch(
  "/:id/role",
  authorizeRoles("ADMIN"),
  validate(updateUserRoleSchema),
  updateRole
);

export default userRoutes;
