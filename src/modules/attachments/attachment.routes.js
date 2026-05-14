import { Router } from "express";

import {
  uploadOne,
  index,
  show,
  remove,
} from "./attachment.controller.js";

import { upload } from "../../core/upload/multer.config.js";
import { validate } from "../../core/middlewares/validate.middleware.js";

import {
  uploadAttachmentSchema,
  attachmentIdSchema,
} from "./attachment.schema.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../users/auth/auth.middleware.js";

const attachmentRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Attachments
 *   description: Upload e gestão de anexos
 */

attachmentRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/attachments:
 *   post:
 *     summary: Enviar anexo
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - context
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               context:
 *                 type: string
 *                 example: PRODUCT_IMAGE
 *               relatedTo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Anexo enviado com sucesso
 *       400:
 *         description: Arquivo ou dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
attachmentRoutes.post(
  "/",
  authorizeRoles("ADMIN", "ATTENDANT", "TECHNICIAN"),
  upload.single("file"),
  validate(uploadAttachmentSchema),
  uploadOne
);

/**
 * @swagger
 * /api/attachments:
 *   get:
 *     summary: Listar anexos
 *     tags: [Attachments]
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
 *           example: PRODUCT_IMAGE
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: image
 *       - in: query
 *         name: relatedTo
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: termo
 *     responses:
 *       200:
 *         description: Lista de anexos retornada com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
attachmentRoutes.get(
  "/",
  authorizeRoles("ADMIN", "ATTENDANT", "TECHNICIAN"),
  index
);

/**
 * @swagger
 * /api/attachments/{id}:
 *   get:
 *     summary: Buscar anexo por ID
 *     tags: [Attachments]
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
 *         description: Anexo encontrado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Anexo não encontrado
 */
attachmentRoutes.get(
  "/:id",
  authorizeRoles("ADMIN", "ATTENDANT", "TECHNICIAN"),
  validate(attachmentIdSchema),
  show
);

/**
 * @swagger
 * /api/attachments/{id}:
 *   delete:
 *     summary: Remover anexo
 *     tags: [Attachments]
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
 *         description: Anexo removido com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Anexo não encontrado
 */
attachmentRoutes.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  validate(attachmentIdSchema),
  remove
);

export default attachmentRoutes;
