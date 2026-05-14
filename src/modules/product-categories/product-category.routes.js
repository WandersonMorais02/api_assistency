import { Router } from "express";

import {
  create,
  index,
  show,
  update,
  remove,
} from "./product-category.controller.js";

import { validate } from "../../core/middlewares/validate.middleware.js";

import {
  createProductCategorySchema,
  updateProductCategorySchema,
  productCategoryIdSchema,
} from "./product-category.schema.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../users/auth/auth.middleware.js";

const productCategoryRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Product Categories
 *   description: Gestão de categorias de produtos
 */

/**
 * @swagger
 * /api/product-categories:
 *   get:
 *     summary: Listar categorias de produtos
 *     tags: [Product Categories]
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 */
productCategoryRoutes.get("/", index);

/**
 * @swagger
 * /api/product-categories/{id}:
 *   get:
 *     summary: Buscar categoria por ID
 *     tags: [Product Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
productCategoryRoutes.get(
  "/:id",
  validate(productCategoryIdSchema),
  show
);

/**
 * @swagger
 * /api/product-categories:
 *   post:
 *     summary: Criar categoria de produto
 *     tags: [Product Categories]
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
 *                 example: Smartphones
 *               description:
 *                 type: string
 *                 example: Categoria de celulares e smartphones
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       409:
 *         description: Categoria já cadastrada
 */
productCategoryRoutes.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(createProductCategorySchema),
  create
);

/**
 * @swagger
 * /api/product-categories/{id}:
 *   put:
 *     summary: Atualizar categoria de produto
 *     tags: [Product Categories]
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
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Categoria não encontrada
 */
productCategoryRoutes.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "ATTENDANT"),
  validate(updateProductCategorySchema),
  update
);

/**
 * @swagger
 * /api/product-categories/{id}:
 *   delete:
 *     summary: Remover categoria de produto
 *     tags: [Product Categories]
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
 *         description: Categoria removida com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Categoria não encontrada
 */
productCategoryRoutes.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  validate(productCategoryIdSchema),
  remove
);

export default productCategoryRoutes;
