import { ServiceOrder } from "../service-orders/service-order.model.js";

import { customerPortalServiceOrderDTO } from "./customer-portal.dto.js";

import { AppError } from "../../core/errors/app-error.js";
import { emitServiceOrderUpdated } from "../../socket/service-order.events.js";

export async function findPublicServiceOrderByProtocol(protocol) {
  const serviceOrder = await ServiceOrder.findOne({
    protocol,
    isActive: true,
  })
    .populate("client", "name phone")
    .populate({
      path: "device",
      select:
        "deviceType brand model serialNumber imei color accessories reportedIssue physicalCondition observations images",
      populate: [
        {
          path: "deviceType",
          select: "name slug",
        },
        {
          path: "images",
          select: "originalName url mimetype category context createdAt",
        },
      ],
    })
    .populate("technician", "name role")
    .populate("timeline.createdBy", "name role")
    .populate({
      path: "attachments",
      select: "originalName url mimetype category context createdAt",
    });

  if (!serviceOrder) {
    throw new AppError("Protocolo não encontrado", 404);
  }

  return customerPortalServiceOrderDTO(serviceOrder);
}

export async function approveServiceOrderBudget({
  protocol,
  approved,
  customerNote,
}) {
  const serviceOrder = await ServiceOrder.findOne({
    protocol,
    isActive: true,
  });

  if (!serviceOrder) {
    throw new AppError("Protocolo não encontrado", 404);
  }

  if (serviceOrder.status !== "WAITING_APPROVAL") {
    throw new AppError(
      "Esta ordem de serviço não está aguardando aprovação",
      400
    );
  }

  serviceOrder.approvedByClient = approved;
  serviceOrder.status = approved ? "APPROVED" : "CANCELED";

  serviceOrder.timeline.push({
    status: serviceOrder.status,
    message: approved
      ? "Orçamento aprovado pelo cliente"
      : `Orçamento recusado pelo cliente${
          customerNote ? `: ${customerNote}` : ""
        }`,
    createdBy: serviceOrder.technician || undefined,
  });

  if (!approved) {
    serviceOrder.canceledAt = new Date();
  }

  await serviceOrder.save();

  const updatedServiceOrder = await findPublicServiceOrderByProtocol(protocol);

  emitServiceOrderUpdated(updatedServiceOrder);

  return updatedServiceOrder;
}
