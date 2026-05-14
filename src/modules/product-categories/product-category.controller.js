import {
  createProductCategory,
  listProductCategories,
  findProductCategoryById,
  updateProductCategory,
  deleteProductCategory,
} from "./product-category.service.js";

export async function create(req, res, next) {
  try {
    const category = await createProductCategory(req.validated.body);
    return res.status(201).json(category);
  } catch (error) {
    return next(error);
  }
}

export async function index(req, res, next) {
  try {
    const categories = await listProductCategories();
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
}

export async function show(req, res, next) {
  try {
    const category = await findProductCategoryById(req.params.id);
    return res.json(category);
  } catch (error) {
    return next(error);
  }
}

export async function update(req, res, next) {
  try {
    const category = await updateProductCategory(
      req.params.id,
      req.validated.body
    );

    return res.json(category);
  } catch (error) {
    return next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const category = await deleteProductCategory(req.params.id);
    return res.json(category);
  } catch (error) {
    return next(error);
  }
}
