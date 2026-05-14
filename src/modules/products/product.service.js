import { Product } from "./product.model.js";
import { productDTO } from "./product.dto.js";

import { ProductCategory } from "../product-categories/product-category.model.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

import { AppError } from "../../core/errors/app-error.js";
import { generateSlug } from "../../core/utils/generate-slug.js";

import {
  getPaginationParams,
  buildPaginationResponse,
} from "../../core/utils/pagination.js";

import { paginatedDTO } from "../../core/dtos/paginated.dto.js";

export async function createProduct(data, userId) {
  const slug = generateSlug(data.name);

  const exists = await Product.findOne({ slug });

  if (exists) {
    throw new AppError("Produto já cadastrado com esse nome", 409);
  }

  if (data.category) {
    const category = await ProductCategory.findById(data.category);

    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }
  }

  const product = await Product.create({
    ...data,
    slug,
  });

  await createAuditLog({
    action: "PRODUCT_CREATED",
    entity: "Product",
    entityId: product._id,
    performedBy: userId,
    changes: {
      name: {
        from: null,
        to: product.name,
      },
      price: {
        from: null,
        to: product.price,
      },
      stock: {
        from: null,
        to: product.stock,
      },
      isPublished: {
        from: null,
        to: product.isPublished,
      },
    },
    metadata: {
      slug: product.slug,
    },
  });

  return findProductById(product._id);
}

export async function listProducts(query = {}) {
  const { page, limit, skip } = getPaginationParams(query);

  const filter = {
    isActive: true,
  };

  if (query.onlyPublished === "true" || query.onlyPublished === true) {
    filter.isPublished = true;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.condition) {
    filter.condition = query.condition;
  }

  if (query.isFeatured !== undefined) {
    filter.isFeatured = query.isFeatured === "true";
  }

  if (query.search) {
    filter.$or = [
      { name: new RegExp(query.search, "i") },
      { description: new RegExp(query.search, "i") },
      { slug: new RegExp(query.search, "i") },
    ];
  }

  const [data, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .populate("images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Product.countDocuments(filter),
  ]);

  const result = buildPaginationResponse({
    data,
    total,
    page,
    limit,
  });

  return paginatedDTO(result, productDTO);
}

export async function findProductById(id) {
  const product = await Product.findById(id)
    .populate("category", "name slug")
    .populate("images");

  if (!product) {
    throw new AppError("Produto não encontrado", 404);
  }

  return productDTO(product);
}

export async function updateProduct(id, data, userId) {
  const currentProduct = await Product.findById(id);

  if (!currentProduct) {
    throw new AppError("Produto não encontrado", 404);
  }

  const oldName = currentProduct.name;
  const oldPrice = currentProduct.price;
  const oldPromotionalPrice = currentProduct.promotionalPrice;
  const oldStock = currentProduct.stock;
  const oldIsPublished = currentProduct.isPublished;
  const oldIsFeatured = currentProduct.isFeatured;
  const oldCategory = currentProduct.category;

  const updateData = { ...data };

  if (data.name) {
    const slug = generateSlug(data.name);

    const exists = await Product.findOne({
      _id: { $ne: id },
      slug,
    });

    if (exists) {
      throw new AppError("Produto já cadastrado com esse nome", 409);
    }

    updateData.slug = slug;
  }

  if (data.category) {
    const category = await ProductCategory.findById(data.category);

    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }
  }

  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("category", "name slug")
    .populate("images");

  if (!product) {
    throw new AppError("Produto não encontrado", 404);
  }

  await createAuditLog({
    action: "PRODUCT_UPDATED",
    entity: "Product",
    entityId: product._id,
    performedBy: userId,
    changes: {
      name: {
        from: oldName,
        to: product.name,
      },
      price: {
        from: oldPrice,
        to: product.price,
      },
      promotionalPrice: {
        from: oldPromotionalPrice ?? null,
        to: product.promotionalPrice ?? null,
      },
      stock: {
        from: oldStock,
        to: product.stock,
      },
      isPublished: {
        from: oldIsPublished,
        to: product.isPublished,
      },
      isFeatured: {
        from: oldIsFeatured,
        to: product.isFeatured,
      },
      category: {
        from: oldCategory ? String(oldCategory) : null,
        to: product.category ? String(product.category._id || product.category) : null,
      },
    },
    metadata: {
      slug: product.slug,
    },
  });

  return productDTO(product);
}

export async function deleteProduct(id, userId) {
  const product = await Product.findByIdAndUpdate(
    id,
    { isActive: false, isPublished: false },
    { new: true }
  )
    .populate("category", "name slug")
    .populate("images");

  if (!product) {
    throw new AppError("Produto não encontrado", 404);
  }

  await createAuditLog({
    action: "PRODUCT_DELETED",
    entity: "Product",
    entityId: product._id,
    performedBy: userId,
    changes: {
      isActive: {
        from: true,
        to: false,
      },
      isPublished: {
        from: true,
        to: false,
      },
    },
    metadata: {
      name: product.name,
      slug: product.slug,
    },
  });

  return productDTO(product);
}
