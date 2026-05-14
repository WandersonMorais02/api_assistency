import { Router } from "express";

import {
  serviceOrderPdf,
  receiptPdf,
} from "./pdf.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../users/auth/auth.middleware.js";

const pdfRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: PDFs
 *   description: Geração de PDFs do sistema
 */

pdfRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/pdfs/service-orders/{id}:
 *   get:
 *     summary: Gerar PDF da ordem de serviço
 *     tags: [PDFs]
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
 *         description: PDF da ordem de serviço gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Ordem de serviço não encontrada
 */
pdfRoutes.get(
  "/service-orders/:id",
  authorizeRoles("ADMIN", "ATTENDANT", "TECHNICIAN"),
  serviceOrderPdf
);

/**
 * @swagger
 * /api/pdfs/receipts/{id}:
 *   get:
 *     summary: Gerar PDF de comprovante/recibo
 *     tags: [PDFs]
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
 *         description: PDF do recibo gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Recibo não encontrado
 */
pdfRoutes.get(
  "/receipts/:id",
  authorizeRoles("ADMIN", "ATTENDANT"),
  receiptPdf
);

export default pdfRoutes;
