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
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Wantech Assistência Técnica
 *               document:
 *                 type: string
 *                 example: "00.000.000/0001-00"
 *               email:
 *                 type: string
 *                 example: contato@wantech.space
 *               phone:
 *                 type: string
 *                 example: "92999999999"
 *               whatsapp:
 *                 type: string
 *                 example: "92999999999"
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: Av. Exemplo
 *                   number:
 *                     type: string
 *                     example: "123"
 *                   neighborhood:
 *                     type: string
 *                     example: Centro
 *                   city:
 *                     type: string
 *                     example: Manaus
 *                   state:
 *                     type: string
 *                     example: AM
 *                   zipCode:
 *                     type: string
 *                     example: "69000000"
 *               openingHours:
 *                 type: string
 *                 example: Segunda a sexta, 08h às 18h
 *               logo:
 *                 type: string
 *                 description: ID do anexo da logo
 *               consentTerms:
 *                 type: string
 *               warrantyPolicy:
 *                 type: string
 *               socialLinks:
 *                 type: object
 *                 properties:
 *                   instagram:
 *                     type: string
 *                   facebook:
 *                     type: string
 *                   tiktok:
 *                     type: string
 *                   website:
 *                     type: string
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
