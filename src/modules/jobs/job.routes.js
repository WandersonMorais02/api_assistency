import { Router } from "express";

import {
  create,
  index,
  show,
  update,
  remove,
  apply,
  updateApplication,
} from "./job.controller.js";

import { validate } from "../../core/middlewares/validate.middleware.js";

import {
  createJobSchema,
  updateJobSchema,
  applyJobSchema,
  updateApplicationStatusSchema,
  jobIdSchema,
} from "./job.schema.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../users/auth/auth.middleware.js";

const jobRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Gestão de vagas e candidaturas
 */

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Listar vagas
 *     tags: [Jobs]
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
 *         name: onlyPublished
 *         schema:
 *           type: boolean
 *           example: true
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           example: CLT
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: técnico
 *     responses:
 *       200:
 *         description: Lista de vagas retornada com sucesso
 */
jobRoutes.get("/", index);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Buscar vaga por ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vaga encontrada
 *       404:
 *         description: Vaga não encontrada
 */
jobRoutes.get("/:id", validate(jobIdSchema), show);

/**
 * @swagger
 * /api/jobs/{id}/apply:
 *   post:
 *     summary: Candidatar-se para uma vaga
 *     tags: [Jobs]
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
 *               message:
 *                 type: string
 *               resume:
 *                 type: string
 *     responses:
 *       201:
 *         description: Candidatura enviada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Vaga não encontrada
 */
jobRoutes.post("/:id/apply", validate(applyJobSchema), apply);

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Criar vaga
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Técnico de Informática
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *                 example: Manaus - AM
 *               salary:
 *                 type: number
 *                 example: 2500
 *               type:
 *                 type: string
 *                 example: CLT
 *               image:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Vaga criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
jobRoutes.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(createJobSchema),
  create
);

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Atualizar vaga
 *     tags: [Jobs]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: number
 *               type:
 *                 type: string
 *               image:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Vaga atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Vaga não encontrada
 */
jobRoutes.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(updateJobSchema),
  update
);

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Remover vaga
 *     tags: [Jobs]
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
 *         description: Vaga removida com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Vaga não encontrada
 */
jobRoutes.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  validate(jobIdSchema),
  remove
);

/**
 * @swagger
 * /api/jobs/{jobId}/applications/{applicationId}/status:
 *   patch:
 *     summary: Atualizar status da candidatura
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: APPROVED
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Vaga ou candidatura não encontrada
 */
jobRoutes.patch(
  "/:jobId/applications/:applicationId/status",
  authMiddleware,
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(updateApplicationStatusSchema),
  updateApplication
);

export default jobRoutes;
