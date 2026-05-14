import {
  createServiceOrder,
  listServiceOrders,
  findServiceOrderById,
  updateServiceOrder,
  deleteServiceOrder,
} from "./service-order.service.js";

export async function create(req, res, next) {
  try {
    const serviceOrder = await createServiceOrder(
      req.validated.body,
      req.user.id
    );

    return res.status(201).json(serviceOrder);
  } catch (error) {
    return next(error);
  }
}

export async function index(req, res, next) {
  try {
    const serviceOrders = await listServiceOrders(req.query);

    return res.json(serviceOrders);
  } catch (error) {
    return next(error);
  }
}

export async function show(req, res, next) {
  try {
    const serviceOrder = await findServiceOrderById(
      req.params.id
    );

    return res.json(serviceOrder);
  } catch (error) {
    return next(error);
  }
}

export async function update(req, res, next) {
  try {
    const serviceOrder = await updateServiceOrder(
      req.params.id,
      req.validated.body,
      req.user.id
    );

    return res.json(serviceOrder);
  } catch (error) {
    return next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const serviceOrder = await deleteServiceOrder(
      req.params.id,
      req.user.id
    );

    return res.json(serviceOrder);
  } catch (error) {
    return next(error);
  }
}
