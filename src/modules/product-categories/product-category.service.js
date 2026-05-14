import { ProductCategory } from "./product-category.model.js";

import {
  productCategoryDTO,
  productCategoriesDTO,
} from "./product-category.dto.js";

import { AppError } from "../../core/errors/app-error.js";
import { generateSlug } from "../../core/utils/generate-slug.js";

export async function createProductCategory(data) {
  const slug = generateSlug(data.name);

  const exists = await ProductCategory.findOne({
    $or: [{ name: data.name }, { slug }],
  });

  if (exists) {
    throw new AppError("Categoria já cadastrada", 409);
  }

  const category = await ProductCategory.create({
    name: data.name,
    slug,
    description: data.description,
    isActive: data.isActive ?? true,
  });

  return productCategoryDTO(category);
}

export async function listProductCategories() {
  const categories = await ProductCategory.find({ isActive: true }).sort({
    name: 1,
  });

  return productCategoriesDTO(categories);
}

export async function findProductCategoryById(id) {
  const category = await ProductCategory.findById(id);

  if (!category) {
    throw new AppError("Categoria não encontrada", 404);
  }

  return productCategoryDTO(category);
}

export async function updateProductCategory(id, data) {
  const updateData = { ...data };

  if (data.name) {
    const slug = generateSlug(data.name);

    const exists = await ProductCategory.findOne({
      _id: { $ne: id },
      $or: [{ name: data.name }, { slug }],
    });

    if (exists) {
      throw new AppError("Categoria já cadastrada", 409);
    }

    updateData.slug = slug;
  }

  const category = await ProductCategory.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new AppError("Categoria não encontrada", 404);
  }

  return productCategoryDTO(category);
}

export async function deleteProductCategory(id) {
  const category = await ProductCategory.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!category) {
    throw new AppError("Categoria não encontrada", 404);
  }

  return productCategoryDTO(category);
}
