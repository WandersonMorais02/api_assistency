import { DeviceType } from "./device-type.model.js";
import { deviceTypeDTO, deviceTypesDTO } from "./device-type.dto.js";

import { AppError } from "../../core/errors/app-error.js";
import { generateSlug } from "../../core/utils/generate-slug.js";

export async function createDeviceType(data) {
  const slug = generateSlug(data.name);

  const exists = await DeviceType.findOne({
    $or: [{ name: data.name }, { slug }],
  });

  if (exists) {
    throw new AppError("Tipo de equipamento já cadastrado", 409);
  }

  const deviceType = await DeviceType.create({
    name: data.name,
    slug,
    isActive: data.isActive ?? true,
  });

  return deviceTypeDTO(deviceType);
}

export async function listDeviceTypes() {
  const deviceTypes = await DeviceType.find({ isActive: true }).sort({
    name: 1,
  });

  return deviceTypesDTO(deviceTypes);
}

export async function findDeviceTypeById(id) {
  const deviceType = await DeviceType.findById(id);

  if (!deviceType) {
    throw new AppError("Tipo de equipamento não encontrado", 404);
  }

  return deviceTypeDTO(deviceType);
}

export async function updateDeviceType(id, data) {
  const updateData = { ...data };

  if (data.name) {
    const slug = generateSlug(data.name);

    const exists = await DeviceType.findOne({
      _id: { $ne: id },
      $or: [{ name: data.name }, { slug }],
    });

    if (exists) {
      throw new AppError("Tipo de equipamento já cadastrado", 409);
    }

    updateData.slug = slug;
  }

  const deviceType = await DeviceType.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!deviceType) {
    throw new AppError("Tipo de equipamento não encontrado", 404);
  }

  return deviceTypeDTO(deviceType);
}

export async function deleteDeviceType(id) {
  const deviceType = await DeviceType.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!deviceType) {
    throw new AppError("Tipo de equipamento não encontrado", 404);
  }

  return deviceTypeDTO(deviceType);
}
