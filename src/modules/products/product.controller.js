import {
  createProduct,
  listProducts,
  findProductById,
  updateProduct,
  deleteProduct,
} from "./product.service.js";

export async function create(req, res, next) {
  try {
    const product = await createProduct(
      req.validated.body,
      req.user.id
    );

    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
}

export async function index(req, res, next) {
  try {
    const products = await listProducts(req.query);

    return res.json(products);
  } catch (error) {
    return next(error);
  }
}

export async function show(req, res, next) {
  try {
    const product = await findProductById(req.params.id);
    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

export async function update(req, res, next) {
  try {
    const product = await updateProduct(
      req.params.id,
      req.validated.body,
      req.user.id
    );

    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const product = await deleteProduct(
      req.params.id,
      req.user.id
    );

    return res.json(product);
  } catch (error) {
    return next(error);
  }
}
