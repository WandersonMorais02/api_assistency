import { Router } from "express";

import {
  upsertIntent,
  createTokenTraining,
  createAnswerTraining,
  validateRelation,
  rejectRelation,
  approveTrainingLog,

  indexIntents,
  indexTokens,
  indexAnswers,
  indexRelations,
  indexTrainings,
} from "./bot.controller.js";

import { validate } from "../../core/middlewares/validate.middleware.js";

import {
  createOrUpdateIntentSchema,
  trainTokenSchema,
  trainAnswerSchema,
  validateTokenRelationSchema,
  relationIdSchema,
  approveTrainingSchema,
} from "./bot.schema.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../users/auth/auth.middleware.js";

const botRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Bot Training
 *   description: Treinamento supervisionado da IA interna
 */

botRoutes.use(authMiddleware);


/**
 * @swagger
 * /api/bot/intents:
 *   get:
 *     summary: Listar intenções da IA
 *     tags: [Bot Training]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de intenções
 */
botRoutes.get(
  "/intents",
  authorizeRoles("ADMIN", "TECHNICIAN"),
  indexIntents
);

/**
 * @swagger
 * /api/bot/tokens:
 *   get:
 *     summary: Listar tokens treinados
 *     tags: [Bot Training]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tokens
 */
botRoutes.get(
  "/tokens",
  authorizeRoles("ADMIN", "TECHNICIAN"),
  indexTokens
);

/**
 * @swagger
 * /api/bot/answers:
 *   get:
 *     summary: Listar respostas treinadas
 *     tags: [Bot Training]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de respostas
 */
botRoutes.get(
  "/answers",
  authorizeRoles("ADMIN", "TECHNICIAN"),
  indexAnswers
);

/**
 * @swagger
 * /api/bot/relations:
 *   get:
 *     summary: Listar relações semânticas
 *     tags: [Bot Training]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de relações
 */
botRoutes.get(
  "/relations",
  authorizeRoles("ADMIN", "TECHNICIAN"),
  indexRelations
);

/**
 * @swagger
 * /api/bot/trainings:
 *   get:
 *     summary: Listar logs de treinamento
 *     tags: [Bot Training]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de treinamentos
 */
botRoutes.get(
  "/trainings",
  authorizeRoles("ADMIN", "TECHNICIAN"),
  indexTrainings
);

/**
 * @swagger
 * /api/bot/intents:
 *   post:
 *     summary: Criar ou atualizar intenção
 *     tags: [Bot Training]
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
 *                 example: WATER_DAMAGE
 *               description:
 *                 type: string
 *                 example: Casos relacionados a contato com líquido ou oxidação
 *               confidenceThreshold:
 *                 type: number
 *                 example: 0.3
 *     responses:
 *       201:
 *         description: Intenção criada ou atualizada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
botRoutes.post(
  "/intents",
  authorizeRoles("ADMIN", "TECHNICIAN"),
  validate(createOrUpdateIntentSchema),
  upsertIntent
);

/**
 * @swagger
 * /api/bot/tokens:
 *   post:
 *     summary: Treinar token vinculando a uma intenção
 *     tags: [Bot Training]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - intentId
 *             properties:
 *               token:
 *                 type: string
 *                 example: molhou
 *               intentId:
 *                 type: string
 *               weight:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Token treinado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Intenção não encontrada
 */
botRoutes.post(
  "/tokens",
  authorizeRoles("ADMIN", "TECHNICIAN"),
  validate(trainTokenSchema),
  createTokenTraining
);

/**
 * @swagger
 * /api/bot/answers:
 *   post:
 *     summary: Treinar resposta para uma intenção
 *     tags: [Bot Training]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - intentId
 *               - content
 *             properties:
 *               intentId:
 *                 type: string
 *               content:
 *                 type: string
 *                 example: Em casos de contato com líquido, desligue o aparelho e não tente carregar. O ideal é trazer para avaliação técnica.
 *               priority:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Resposta treinada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Intenção não encontrada
 */
botRoutes.post(
  "/answers",
  authorizeRoles("ADMIN", "TECHNICIAN"),
  validate(trainAnswerSchema),
  createAnswerTraining
);

/**
 * @swagger
 * /api/bot/relations/{id}/validate:
 *   patch:
 *     summary: Validar relação semântica entre tokens
 *     tags: [Bot Training]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da relação semântica
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               similarity:
 *                 type: number
 *                 example: 0.8
 *     responses:
 *       200:
 *         description: Relação validada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Relação não encontrada
 */
botRoutes.patch(
  "/relations/:id/validate",
  authorizeRoles("ADMIN", "TECHNICIAN"),
  validate(validateTokenRelationSchema),
  validateRelation
);

/**
 * @swagger
 * /api/bot/relations/{id}/reject:
 *   patch:
 *     summary: Rejeitar relação semântica entre tokens
 *     tags: [Bot Training]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da relação semântica
 *     responses:
 *       200:
 *         description: Relação rejeitada com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Relação não encontrada
 */
botRoutes.patch(
  "/relations/:id/reject",
  authorizeRoles("ADMIN", "TECHNICIAN"),
  validate(relationIdSchema),
  rejectRelation
);

/**
 * @swagger
 * /api/bot/trainings/{id}/approve:
 *   patch:
 *     summary: Aprovar registro de treinamento
 *     tags: [Bot Training]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de treinamento
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               finalResponse:
 *                 type: string
 *                 example: Resposta revisada e aprovada pelo técnico.
 *               intentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Treinamento aprovado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Registro de treinamento não encontrado
 */
botRoutes.patch(
  "/trainings/:id/approve",
  authorizeRoles("ADMIN", "TECHNICIAN"),
  validate(approveTrainingSchema),
  approveTrainingLog
);

export default botRoutes;
