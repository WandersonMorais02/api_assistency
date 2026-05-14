import { ServiceOrder } from "./service-order.model.js";
import { serviceOrderDTO } from "./service-order.dto.js";

import { Client } from "../clients/client.model.js";
import { Device } from "../devices/device.model.js";
import { User } from "../users/user.model.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

import { AppError } from "../../core/errors/app-error.js";
import { generateProtocol } from "../../core/utils/generate-protocol.js";
import { emitServiceOrderUpdated } from "../../socket/service-order.events.js";

import {
  getPaginationParams,
  buildPaginationResponse,
} from "../../core/utils/pagination.js";

import { paginatedDTO } from "../../core/dtos/paginated.dto.js";

export async function createServiceOrder(data, userId) {
  const client = await Client.findById(data.client);

  if (!client) {
    throw new AppError("Cliente não encontrado", 404);
  }

  const device = await Device.findById(data.device);

  if (!device) {
    throw new AppError("Equipamento não encontrado", 404);
  }

  if (String(device.client) !== String(client._id)) {
    throw new AppError(
      "Este equipamento não pertence ao cliente informado",
      400
    );
  }

  if (data.technician) {
    const technician = await User.findById(data.technician);

    if (!technician) {
      throw new AppError("Técnico não encontrado", 404);
    }

    if (!["ADMIN", "TECHNICIAN"].includes(technician.role)) {
      throw new AppError("Usuário informado não é técnico", 400);
    }
  }

  const protocol = generateProtocol();

  const serviceOrder = await ServiceOrder.create({
    ...data,
    protocol,
    timeline: [
      {
        status: "RECEIVED",
        message: "Ordem de serviço criada",
        createdBy: userId,
      },
    ],
  });

  await createAuditLog({
    action: "SERVICE_ORDER_CREATED",
    entity: "ServiceOrder",
    entityId: serviceOrder._id,
    performedBy: userId,
    changes: {
      status: {
        from: null,
        to: "RECEIVED",
      },
    },
    metadata: {
      protocol: serviceOrder.protocol,
      client: String(serviceOrder.client),
      device: String(serviceOrder.device),
    },
  });

  return findServiceOrderById(serviceOrder._id);
}

export async function listServiceOrders(query = {}) {
  const { page, limit, skip } = getPaginationParams(query);

  const filter = {
    isActive: true,
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.client) {
    filter.client = query.client;
  }

  if (query.device) {
    filter.device = query.device;
  }

  if (query.technician) {
    filter.technician = query.technician;
  }

  if (query.protocol) {
    filter.protocol = new RegExp(query.protocol, "i");
  }

  const [data, total] = await Promise.all([
    ServiceOrder.find(filter)
      .populate("client", "name phone email cpf")
      .populate({
        path: "device",
        populate: {
          path: "deviceType",
        },
      })
      .populate("technician", "name email role")
      .populate("timeline.createdBy", "name role")
      .populate("attachments")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    ServiceOrder.countDocuments(filter),
  ]);

  const result = buildPaginationResponse({
    data,
    total,
    page,
    limit,
  });

  return paginatedDTO(result, serviceOrderDTO);
}

export async function findServiceOrderById(id) {
  const serviceOrder = await ServiceOrder.findById(id)
    .populate("client")
    .populate({
      path: "device",
      populate: {
        path: "deviceType",
      },
    })
    .populate("technician", "name email role")
    .populate("timeline.createdBy", "name role")
    .populate("attachments");

  if (!serviceOrder) {
    throw new AppError("Ordem de serviço não encontrada", 404);
  }

  return serviceOrderDTO(serviceOrder);
}

export async function updateServiceOrder(id, data, userId) {
  const serviceOrder = await ServiceOrder.findById(id);

  if (!serviceOrder) {
    throw new AppError("Ordem de serviço não encontrada", 404);
  }

  const oldStatus = serviceOrder.status;
  const oldTechnician = serviceOrder.technician;
  const oldEstimatedBudget = serviceOrder.estimatedBudget;
  const oldFinalPrice = serviceOrder.finalPrice;
  const oldApprovedByClient = serviceOrder.approvedByClient;

  if (data.technician) {
    const technician = await User.findById(data.technician);

    if (!technician) {
      throw new AppError("Técnico não encontrado", 404);
    }

    if (!["ADMIN", "TECHNICIAN"].includes(technician.role)) {
      throw new AppError("Usuário informado não é técnico", 400);
    }
  }

  if (data.status && data.status !== serviceOrder.status) {
    serviceOrder.timeline.push({
      status: data.status,
      message: `Status alterado para ${data.status}`,
      createdBy: userId,
    });

    if (data.status === "DELIVERED") {
      serviceOrder.deliveredAt = new Date();
    }

    if (data.status === "CANCELED") {
      serviceOrder.canceledAt = new Date();
    }
  }

  Object.assign(serviceOrder, data);

  await serviceOrder.save();

  await createAuditLog({
    action: "SERVICE_ORDER_UPDATED",
    entity: "ServiceOrder",
    entityId: serviceOrder._id,
    performedBy: userId,
    changes: {
      status: {
        from: oldStatus,
        to: serviceOrder.status,
      },
      technician: {
        from: oldTechnician ? String(oldTechnician) : null,
        to: serviceOrder.technician
          ? String(serviceOrder.technician)
          : null,
      },
      estimatedBudget: {
        from: oldEstimatedBudget,
        to: serviceOrder.estimatedBudget,
      },
      finalPrice: {
        from: oldFinalPrice,
        to: serviceOrder.finalPrice,
      },
      approvedByClient: {
        from: oldApprovedByClient,
        to: serviceOrder.approvedByClient,
      },
    },
    metadata: {
      protocol: serviceOrder.protocol,
    },
  });

  const updatedServiceOrder = await findServiceOrderById(serviceOrder._id);

  emitServiceOrderUpdated(updatedServiceOrder);

  return updatedServiceOrder;
}

export async function deleteServiceOrder(id, userId) {
  const serviceOrder = await ServiceOrder.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  )
    .populate("client")
    .populate({
      path: "device",
      populate: {
        path: "deviceType",
      },
    })
    .populate("technician", "name email role")
    .populate("timeline.createdBy", "name role")
    .populate("attachments");

  if (!serviceOrder) {
    throw new AppError("Ordem de serviço não encontrada", 404);
  }

  await createAuditLog({
    action: "SERVICE_ORDER_DELETED",
    entity: "ServiceOrder",
    entityId: serviceOrder._id,
    performedBy: userId,
    changes: {
      isActive: {
        from: true,
        to: false,
      },
    },
    metadata: {
      protocol: serviceOrder.protocol,
    },
  });

  return serviceOrderDTO(serviceOrder);
}
