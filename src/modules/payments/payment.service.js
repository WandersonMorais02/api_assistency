import { Payment } from "./payment.model.js";
import { paymentDTO } from "./payment.dto.js";

import { Order } from "../orders/order.model.js";
import { ServiceOrder } from "../service-orders/service-order.model.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

import { AppError } from "../../core/errors/app-error.js";

import {
  createMercadoPagoPreference,
  getMercadoPagoPayment,
} from "./mercado-pago.service.js";

import {
  getPaginationParams,
  buildPaginationResponse,
} from "../../core/utils/pagination.js";

import { paginatedDTO } from "../../core/dtos/paginated.dto.js";

async function validateRelatedEntity(context, relatedTo) {
  if (context === "ORDER") {
    const order = await Order.findById(relatedTo);

    if (!order) {
      throw new AppError("Pedido relacionado não encontrado", 404);
    }

    return order;
  }

  if (context === "SERVICE_ORDER") {
    const serviceOrder = await ServiceOrder.findById(relatedTo);

    if (!serviceOrder) {
      throw new AppError("Ordem de serviço relacionada não encontrada", 404);
    }

    return serviceOrder;
  }

  throw new AppError("Contexto de pagamento inválido", 400);
}

async function applyPaidStatusToRelatedEntity(payment) {
  if (payment.status !== "PAID") return;

  if (payment.context === "ORDER") {
    await Order.findByIdAndUpdate(payment.relatedTo, {
      paymentStatus: "PAID",
      status: "PAID",
    });
  }

  if (payment.context === "SERVICE_ORDER") {
    await ServiceOrder.findByIdAndUpdate(payment.relatedTo, {
      finalPrice: payment.amount,
    });
  }
}

export async function createPayment(data, userId) {
  await validateRelatedEntity(data.context, data.relatedTo);

  const gateway = data.gateway || "MANUAL";

  const payment = await Payment.create({
    context: data.context,
    relatedTo: data.relatedTo,
    amount: data.amount,
    method: data.method,
    status:
      gateway === "MERCADO_PAGO"
        ? "PENDING"
        : data.status || "PENDING",
    paidAt:
      gateway === "MANUAL" && data.status === "PAID"
        ? new Date()
        : undefined,
    notes: data.notes,
    receivedBy: userId,
    gateway,
  });

  if (gateway === "MERCADO_PAGO") {
    const relatedEntity = await validateRelatedEntity(
      data.context,
      data.relatedTo
    );

    const title =
      data.context === "SERVICE_ORDER"
        ? `Pagamento da OS ${relatedEntity.protocol || payment._id}`
        : `Pagamento do pedido ${relatedEntity._id}`;

    const preference = await createMercadoPagoPreference({
      payment,
      title,
      description: data.notes || title,
    });

    payment.gatewayPreferenceId = preference.id;
    payment.checkoutUrl =
      preference.init_point ||
      preference.sandbox_init_point;
    payment.externalReference = String(payment._id);
    payment.gatewayRawResponse = preference;

    await payment.save();
  }

  await applyPaidStatusToRelatedEntity(payment);

  await createAuditLog({
    action: "PAYMENT_CREATED",
    entity: "Payment",
    entityId: payment._id,
    performedBy: userId,
    changes: {
      status: {
        from: null,
        to: payment.status,
      },
      amount: {
        from: null,
        to: payment.amount,
      },
      method: {
        from: null,
        to: payment.method,
      },
    },
    metadata: {
      context: payment.context,
      relatedTo: String(payment.relatedTo),
      gateway: payment.gateway,
    },
  });

  return findPaymentById(payment._id);
}

export async function listPayments(query = {}) {
  const { page, limit, skip } = getPaginationParams(query);

  const filter = {
    isActive: true,
  };

  if (query.context) {
    filter.context = query.context;
  }

  if (query.relatedTo) {
    filter.relatedTo = query.relatedTo;
  }

  if (query.method) {
    filter.method = query.method;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.receivedBy) {
    filter.receivedBy = query.receivedBy;
  }

  const [data, total] = await Promise.all([
    Payment.find(filter)
      .populate("receivedBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Payment.countDocuments(filter),
  ]);

  const result = buildPaginationResponse({
    data,
    total,
    page,
    limit,
  });

  return paginatedDTO(result, paymentDTO);
}

export async function findPaymentById(id) {
  const payment = await Payment.findById(id).populate(
    "receivedBy",
    "name email role"
  );

  if (!payment) {
    throw new AppError("Pagamento não encontrado", 404);
  }

  return paymentDTO(payment);
}

export async function updatePayment(id, data, userId) {
  const payment = await Payment.findById(id);

  if (!payment) {
    throw new AppError("Pagamento não encontrado", 404);
  }

  const oldAmount = payment.amount;
  const oldMethod = payment.method;
  const oldStatus = payment.status;
  const oldNotes = payment.notes;

  if (data.amount !== undefined) {
    payment.amount = data.amount;
  }

  if (data.method) {
    payment.method = data.method;
  }

  if (data.status) {
    payment.status = data.status;

    if (data.status === "PAID" && !payment.paidAt) {
      payment.paidAt = new Date();
    }

    if (["CANCELED", "REFUNDED"].includes(data.status)) {
      payment.paidAt = undefined;
    }
  }

  if (data.notes !== undefined) {
    payment.notes = data.notes;
  }

  await payment.save();

  await applyPaidStatusToRelatedEntity(payment);

  await createAuditLog({
    action: "PAYMENT_UPDATED",
    entity: "Payment",
    entityId: payment._id,
    performedBy: userId,
    changes: {
      amount: {
        from: oldAmount,
        to: payment.amount,
      },
      method: {
        from: oldMethod,
        to: payment.method,
      },
      status: {
        from: oldStatus,
        to: payment.status,
      },
      notes: {
        from: oldNotes || null,
        to: payment.notes || null,
      },
    },
    metadata: {
      context: payment.context,
      relatedTo: String(payment.relatedTo),
    },
  });

  return findPaymentById(payment._id);
}

export async function deletePayment(id, userId) {
  const payment = await Payment.findByIdAndUpdate(
    id,
    {
      isActive: false,
      status: "CANCELED",
    },
    { new: true }
  ).populate("receivedBy", "name email role");

  if (!payment) {
    throw new AppError("Pagamento não encontrado", 404);
  }

  await createAuditLog({
    action: "PAYMENT_DELETED",
    entity: "Payment",
    entityId: payment._id,
    performedBy: userId,
    changes: {
      isActive: {
        from: true,
        to: false,
      },
      status: {
        from: null,
        to: "CANCELED",
      },
    },
    metadata: {
      context: payment.context,
      relatedTo: String(payment.relatedTo),
      amount: payment.amount,
      method: payment.method,
    },
  });

  return paymentDTO(payment);
}

function mapMercadoPagoStatus(status) {
  if (status === "approved") return "PAID";
  if (status === "pending" || status === "in_process") return "PENDING";
  if (status === "rejected") return "FAILED";
  if (status === "cancelled") return "CANCELED";
  if (status === "refunded") return "REFUNDED";

  return "PENDING";
}

export async function syncMercadoPagoPayment(mercadoPagoPaymentId) {
  const mpPayment = await getMercadoPagoPayment(mercadoPagoPaymentId);

  const externalReference =
    mpPayment.external_reference ||
    mpPayment.metadata?.paymentId ||
    mpPayment.metadata?.payment_id;

  if (!externalReference) {
    throw new AppError("Pagamento sem referência externa", 400);
  }

  const payment = await Payment.findById(externalReference);

  if (!payment) {
    throw new AppError("Pagamento local não encontrado", 404);
  }

  payment.gatewayPaymentId = String(mpPayment.id);
  payment.status = mapMercadoPagoStatus(mpPayment.status);
  payment.gatewayRawResponse = mpPayment;

  if (payment.status === "PAID" && !payment.paidAt) {
    payment.paidAt = new Date();
  }

  await payment.save();
  await applyPaidStatusToRelatedEntity(payment);

  return findPaymentById(payment._id);
}
