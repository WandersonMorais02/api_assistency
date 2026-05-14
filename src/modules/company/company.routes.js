import { Router } from "express";

import { show, upsert } from "./company.controller.js";

import { validate } from "../../core/middlewares/validate.middleware.js";
import { upsertCompanySchema } from "./company.schema.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../users/auth/auth.middleware.js";

const companyRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Configurações da empresa
 */

/**
 * @swagger
 * /api/company:
 *   get:
 *     summary: Buscar informações da empresa
 *     tags: [Company]
 *     responses:
 *       200:
 *         description: Dados da empresa retornados com sucesso
 *       404:
 *         description: Empresa não cadastrada
 */
companyRoutes.get("/", show);

/**
 * @swagger
 * /api/company:
 *   put:
 *     summary: Criar ou atualizar empresa
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Assistência Técnica XPTO
 *               email:
 *                 type: string
 *                 example: contato@empresa.com
 *               phone:
 *                 type: string
 *                 example: 92999999999
 *               whatsapp:
 *                 type: string
 *                 example: 92999999999
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *                 example: Manaus
 *               state:
 *                 type: string
 *                 example: AM
 *               zipCode:
 *                 type: string
 *               logo:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Empresa atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Logo não encontrada
 */
companyRoutes.put(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  validate(upsertCompanySchema),
  upsert
);

export default companyRoutes;
