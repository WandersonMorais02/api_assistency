import { Router } from "express";

import {
  create,
  index,
  show,
  createMessage,
  indexMessages,
  readMessage,
} from "./chat.controller.js";

import { validate } from "../../core/middlewares/validate.middleware.js";

import {
  createRoomSchema,
  sendMessageSchema,
  roomIdSchema,
  messageIdSchema,
  listMessagesSchema,
  markMessageAsReadSchema,
} from "./chat.schema.js";

import {
  authMiddleware,
} from "../users/auth/auth.middleware.js";

const chatRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Internal Chat
 *   description: Chat interno realtime
 */

chatRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/internal-chat:
 *   get:
 *     summary: Listar salas do usuário
 *     tags: [Internal Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de salas retornada com sucesso
 */
chatRoutes.get("/", index);

/**
 * @swagger
 * /api/internal-chat:
 *   post:
 *     summary: Criar sala de chat
 *     tags: [Internal Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - participants
 *             properties:
 *               name:
 *                 type: string
 *                 example: Suporte Técnico
 *               type:
 *                 type: string
 *                 example: GROUP
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Sala criada com sucesso
 */
chatRoutes.post(
  "/",
  validate(createRoomSchema),
  create
);

/**
 * @swagger
 * /api/internal-chat/{id}:
 *   get:
 *     summary: Buscar sala por ID
 *     tags: [Internal Chat]
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
 *         description: Sala encontrada
 *       404:
 *         description: Sala não encontrada
 */
chatRoutes.get(
  "/:id",
  validate(roomIdSchema),
  show
);

/**
 * @swagger
 * /api/internal-chat/{id}/messages:
 *   get:
 *     summary: Listar mensagens da sala
 *     tags: [Internal Chat]
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
 *         description: Mensagens retornadas com sucesso
 */
chatRoutes.get(
  "/:id/messages",
  validate(listMessagesSchema),
  indexMessages
);

/**
 * @swagger
 * /api/internal-chat/messages:
 *   post:
 *     summary: Enviar mensagem
 *     tags: [Internal Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room
 *               - content
 *             properties:
 *               room:
 *                 type: string
 *               type:
 *                 type: string
 *                 example: TEXT
 *               content:
 *                 type: string
 *                 example: Olá equipe
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 */
chatRoutes.post(
  "/messages",
  validate(sendMessageSchema),
  createMessage
);

/**
 * @swagger
 * /api/internal-chat/messages/{id}/read:
 *   patch:
 *     summary: Marcar mensagem como lida
 *     tags: [Internal Chat]
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
 *         description: Mensagem marcada como lida
 */
chatRoutes.patch(
  "/messages/:id/read",
  validate(markMessageAsReadSchema),
  readMessage
);

export default chatRoutes;
