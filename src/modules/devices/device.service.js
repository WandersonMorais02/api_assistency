import { Device } from "./device.model.js";
import { deviceDTO } from "./device.dto.js";

import { Client } from "../clients/client.model.js";
import { DeviceType } from "../device-types/device-type.model.js";

import { AppError } from "../../core/errors/app-error.js";

import {
  getPaginationParams,
  buildPaginationResponse,
} from "../../core/utils/pagination.js";

import { paginatedDTO } from "../../core/dtos/paginated.dto.js";

export async function createDevice(data) {
  const clientExists = await Client.findById(data.client);

  if (!clientExists) {
    throw new AppError("Cliente não encontrado", 404);
  }

  const deviceTypeExists = await DeviceType.findById(data.deviceType);

  if (!deviceTypeExists) {
    throw new AppError("Tipo de equipamento não encontrado", 404);
  }

  const device = await Device.create(data);

  const populatedDevice = await Device.findById(device._id)
    .populate("client", "name phone email")
    .populate("deviceType", "name slug")
    .populate("images");

  return deviceDTO(populatedDevice);
}

export async function listDevices(query = {}) {
  const { page, limit, skip } = getPaginationParams(query);

  const filter = {
    isActive: true,
  };

  if (query.client) {
    filter.client = query.client;
  }

  if (query.deviceType) {
    filter.deviceType = query.deviceType;
  }

  if (query.search) {
    filter.$or = [
      { brand: new RegExp(query.search, "i") },
      { model: new RegExp(query.search, "i") },
      { serialNumber: new RegExp(query.search, "i") },
      { imei: new RegExp(query.search, "i") },
      { reportedIssue: new RegExp(query.search, "i") },
    ];
  }

  const [data, total] = await Promise.all([
    Device.find(filter)
      .populate("client", "name phone email")
      .populate("deviceType", "name slug")
      .populate("images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Device.countDocuments(filter),
  ]);

  const result = buildPaginationResponse({
    data,
    total,
    page,
    limit,
  });

  return paginatedDTO(result, deviceDTO);
}

export async function findDeviceById(id) {
  const device = await Device.findById(id)
    .populate("client", "name phone email cpf")
    .populate("deviceType", "name slug")
    .populate("images")
    .select("+passwordOrPattern");

  if (!device) {
    throw new AppError("Equipamento não encontrado", 404);
  }

  return deviceDTO(device);
}

export async function updateDevice(id, data) {
  if (data.client) {
    const clientExists = await Client.findById(data.client);

    if (!clientExists) {
      throw new AppError("Cliente não encontrado", 404);
    }
  }

  if (data.deviceType) {
    const deviceTypeExists = await DeviceType.findById(data.deviceType);

    if (!deviceTypeExists) {
      throw new AppError("Tipo de equipamento não encontrado", 404);
    }
  }

  const device = await Device.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("client", "name phone email")
    .populate("deviceType", "name slug")
    .populate("images");

  if (!device) {
    throw new AppError("Equipamento não encontrado", 404);
  }

  return deviceDTO(device);
}

export async function deleteDevice(id) {
  const device = await Device.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  )
    .populate("client", "name phone email")
    .populate("deviceType", "name slug")
    .populate("images");

  if (!device) {
    throw new AppError("Equipamento não encontrado", 404);
  }

  return deviceDTO(device);
}
