import { Order } from "./order.model.js";
import { orderDTO } from "./order.dto.js";

import { Product } from "../products/product.model.js";
import { Client } from "../clients/client.model.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

import { AppError } from "../../core/errors/app-error.js";

import {
  getPaginationParams,
  buildPaginationResponse,
} from "../../core/utils/pagination.js";

import { paginatedDTO } from "../../core/dtos/paginated.dto.js";

export async function createOrder(data, userId = null) {
  if (data.client) {
    const client = await Client.findById(data.client);

    if (!client) {
      throw new AppError("Cliente não encontrado", 404);
    }
  }

  const items = [];
  let total = 0;

  for (const item of data.items) {
    const product = await Product.findOne({
      _id: item.product,
      isActive: true,
      isPublished: true,
    });

    if (!product) {
      throw new AppError("Produto não encontrado ou indisponível", 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        `Estoque insuficiente para o produto: ${product.name}`,
        400
      );
    }

    const oldStock = product.stock;

    const unitPrice = product.promotionalPrice ?? product.price;
    const subtotal = unitPrice * item.quantity;

    items.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      unitPrice,
      subtotal,
    });

    total += subtotal;

    product.stock -= item.quantity;

    if (product.stock <= 0) {
      product.isPublished = false;
    }

    await product.save();

    await createAuditLog({
      action: "PRODUCT_STOCK_DECREASED_BY_ORDER",
      entity: "Product",
      entityId: product._id,
      performedBy: userId,
      changes: {
        stock: {
          from: oldStock,
          to: product.stock,
        },
      },
      metadata: {
        productName: product.name,
        quantitySold: item.quantity,
      },
    });
  }

  const order = await Order.create({
    client: data.client,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerEmail: data.customerEmail,
    items,
    total,
    notes: data.notes,
  });

  await createAuditLog({
    action: "ORDER_CREATED",
    entity: "Order",
    entityId: order._id,
    performedBy: userId,
    changes: {
      status: {
        from: null,
        to: order.status,
      },
      paymentStatus: {
        from: null,
        to: order.paymentStatus,
      },
      total: {
        from: null,
        to: order.total,
      },
    },
    metadata: {
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      items: order.items.map(item => ({
        product: String(item.product),
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
    },
  });

  return findOrderById(order._id);
}

export async function listOrders(query = {}) {
  const { page, limit, skip } = getPaginationParams(query);

  const filter = {
    isActive: true,
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.paymentStatus) {
    filter.paymentStatus = query.paymentStatus;
  }

  if (query.client) {
    filter.client = query.client;
  }

  if (query.search) {
    filter.$or = [
      { customerName: new RegExp(query.search, "i") },
      { customerPhone: new RegExp(query.search, "i") },
      { customerEmail: new RegExp(query.search, "i") },
      { "items.name": new RegExp(query.search, "i") },
    ];
  }

  const [data, total] = await Promise.all([
    Order.find(filter)
      .populate("client", "name phone email")
      .populate({
        path: "items.product",
        select: "name slug images",
        populate: {
          path: "images",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Order.countDocuments(filter),
  ]);

  const result = buildPaginationResponse({
    data,
    total,
    page,
    limit,
  });

  return paginatedDTO(result, orderDTO);
}

export async function findOrderById(id) {
  const order = await Order.findById(id)
    .populate("client", "name phone email cpf")
    .populate({
      path: "items.product",
      select: "name slug images",
      populate: {
        path: "images",
      },
    });

  if (!order) {
    throw new AppError("Pedido não encontrado", 404);
  }

  return orderDTO(order);
}

export async function updateOrderStatus(id, data, userId) {
  const order = await Order.findById(id);

  if (!order) {
    throw new AppError("Pedido não encontrado", 404);
  }

  const oldStatus = order.status;
  const oldPaymentStatus = order.paymentStatus;
  const oldNotes = order.notes;

  if (data.status) {
    order.status = data.status;
  }

  if (data.paymentStatus) {
    order.paymentStatus = data.paymentStatus;
  }

  if (data.notes !== undefined) {
    order.notes = data.notes;
  }

  await order.save();

  await createAuditLog({
    action: "ORDER_UPDATED",
    entity: "Order",
    entityId: order._id,
    performedBy: userId,
    changes: {
      status: {
        from: oldStatus,
        to: order.status,
      },
      paymentStatus: {
        from: oldPaymentStatus,
        to: order.paymentStatus,
      },
      notes: {
        from: oldNotes || null,
        to: order.notes || null,
      },
    },
    metadata: {
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      total: order.total,
    },
  });

  return findOrderById(order._id);
}

export async function cancelOrder(id, userId) {
  const order = await Order.findById(id);

  if (!order) {
    throw new AppError("Pedido não encontrado", 404);
  }

  if (order.status === "CANCELED") {
    throw new AppError("Pedido já está cancelado", 400);
  }

  for (const item of order.items) {
    const product = await Product.findById(item.product);

    if (product) {
      const oldStock = product.stock;

      product.stock += item.quantity;

      if (product.stock > 0) {
        product.isPublished = true;
      }

      await product.save();

      await createAuditLog({
        action: "PRODUCT_STOCK_RESTORED_BY_ORDER_CANCEL",
        entity: "Product",
        entityId: product._id,
        performedBy: userId,
        changes: {
          stock: {
            from: oldStock,
            to: product.stock,
          },
          isPublished: {
            from: product.isPublished,
            to: product.isPublished,
          },
        },
        metadata: {
          orderId: String(order._id),
          productName: product.name,
          quantityRestored: item.quantity,
        },
      });
    }
  }

  const oldStatus = order.status;
  const oldIsActive = order.isActive;

  order.status = "CANCELED";
  order.isActive = false;

  await order.save();

  await createAuditLog({
    action: "ORDER_CANCELED",
    entity: "Order",
    entityId: order._id,
    performedBy: userId,
    changes: {
      status: {
        from: oldStatus,
        to: order.status,
      },
      isActive: {
        from: oldIsActive,
        to: order.isActive,
      },
    },
    metadata: {
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      total: order.total,
    },
  });

  return findOrderById(order._id);
}
