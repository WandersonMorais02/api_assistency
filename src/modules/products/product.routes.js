import { Router } from "express";

import {
  create,
  index,
  show,
  showBySlug,
  update,
  remove,
} from "./product.controller.js";

import { validate } from "../../core/middlewares/validate.middleware.js";

import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  productSlugSchema,
} from "./product.schema.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../users/auth/auth.middleware.js";

const productRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestão de produtos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar produtos
 *     tags: [Products]
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
 *           example: iphone
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           example: USED
 *       - in: query
 *         name: onlyPublished
 *         schema:
 *           type: boolean
 *           example: true
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *           example: true
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 */
productRoutes.get("/", index);

/**
 * @swagger
 * /api/products/slug/{slug}:
 *   get:
 *     summary: Buscar produto por slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: iphone-13
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
productRoutes.get(
  "/slug/:slug",
  validate(productSlugSchema),
  showBySlug
);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
productRoutes.get("/:id", validate(productIdSchema), show);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Criar produto
 *     tags: [Products]
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
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 13
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 3500
 *               promotionalPrice:
 *                 type: number
 *                 example: 3200
 *               stock:
 *                 type: integer
 *                 example: 10
 *               category:
 *                 type: string
 *               condition:
 *                 type: string
 *                 example: USED
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               isFeatured:
 *                 type: boolean
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 */
productRoutes.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(createProductSchema),
  create
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags: [Products]
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               promotionalPrice:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               condition:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               isFeatured:
 *                 type: boolean
 *               isPublished:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Produto não encontrado
 */
productRoutes.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(updateProductSchema),
  update
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Remover produto
 *     tags: [Products]
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
 *         description: Produto removido com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Produto não encontrado
 */
productRoutes.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  validate(productIdSchema),
  remove
);

export default productRoutes;
