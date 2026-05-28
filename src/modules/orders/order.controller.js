import {
  createOrder,
  createCheckoutOrder,
  listOrders,
  findOrderById,
  updateOrderStatus,
  cancelOrder,
  syncMercadoPagoOrderPayment,
} from "./order.service.js";

export async function create(req, res, next) {
  try {
    const order = await createOrder(
      req.validated.body,
      req.user?.id || null
    );

    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
}

export async function checkout(req, res, next) {
  try {
    const order = await createCheckoutOrder(
      req.validated.body,
      req.user?.id || null
    );

    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
}

export async function mercadoPagoWebhook(req, res, next) {
  try {
    const paymentId =
      req.body?.data?.id ||
      req.query?.id ||
      req.query?.["data.id"];

    const topic =
      req.body?.type ||
      req.query?.topic;

    if (topic && topic !== "payment") {
      return res.status(200).json({ received: true });
    }

    if (paymentId) {
      await syncMercadoPagoOrderPayment(paymentId);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    return next(error);
  }
}

export async function index(req, res, next) {
  try {
    const orders = await listOrders(req.query);

    return res.json(orders);
  } catch (error) {
    return next(error);
  }
}

export async function show(req, res, next) {
  try {
    const order = await findOrderById(req.params.id);
    return res.json(order);
  } catch (error) {
    return next(error);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const order = await updateOrderStatus(
      req.params.id,
      req.validated.body,
      req.user.id
    );

    return res.json(order);
  } catch (error) {
    return next(error);
  }
}

export async function cancel(req, res, next) {
  try {
    const order = await cancelOrder(
      req.params.id,
      req.user.id
    );

    return res.json(order);
  } catch (error) {
    return next(error);
  }
}
