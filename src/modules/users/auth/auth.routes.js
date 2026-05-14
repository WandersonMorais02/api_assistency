import { Router } from "express";

import { register, login } from "./auth.controller.js";
import { validate } from "../../../core/middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.schema.js";

const authRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação e cadastro de usuários
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Saulo Admin
 *               email:
 *                 type: string
 *                 example: admin@email.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       409:
 *         description: E-mail já cadastrado
 *       400:
 *         description: Dados inválidos
 */
authRoutes.post("/register", validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@email.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: E-mail ou senha inválidos
 *       403:
 *         description: Usuário inativo
 *       400:
 *         description: Dados inválidos
 */
authRoutes.post("/login", validate(loginSchema), login);

export default authRoutes;
