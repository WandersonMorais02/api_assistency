import {
  createPayment,
  listPayments,
  findPaymentById,
  updatePayment,
  deletePayment,
  syncMercadoPagoPayment,
} from "./payment.service.js";


export async function create(req, res, next) {
  try {
    const payment = await createPayment(
      req.validated.body,
      req.user.id
    );

    return res.status(201).json(payment);
  } catch (error) {
    return next(error);
  }
}

export async function index(req, res, next) {
  try {
    const payments = await listPayments(req.query);

    return res.json(payments);
  } catch (error) {
    return next(error);
  }
}

export async function show(req, res, next) {
  try {
    const payment = await findPaymentById(req.params.id);

    return res.json(payment);
  } catch (error) {
    return next(error);
  }
}

export async function update(req, res, next) {
  try {
    const payment = await updatePayment(
      req.params.id,
      req.validated.body,
      req.user.id
    );

    return res.json(payment);
  } catch (error) {
    return next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const payment = await deletePayment(
      req.params.id,
      req.user.id
    );

    return res.json(payment);
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
      await syncMercadoPagoPayment(paymentId);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
}
