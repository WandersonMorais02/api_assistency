import {
  createDeviceType,
  listDeviceTypes,
  findDeviceTypeById,
  updateDeviceType,
  deleteDeviceType,
} from "./device-type.service.js";

export async function create(req, res, next) {
  try {
    const deviceType = await createDeviceType(req.validated.body);
    return res.status(201).json(deviceType);
  } catch (error) {
    return next(error);
  }
}

export async function index(req, res, next) {
  try {
    const deviceTypes = await listDeviceTypes();
    return res.json(deviceTypes);
  } catch (error) {
    return next(error);
  }
}

export async function show(req, res, next) {
  try {
    const deviceType = await findDeviceTypeById(req.params.id);
    return res.json(deviceType);
  } catch (error) {
    return next(error);
  }
}

export async function update(req, res, next) {
  try {
    const deviceType = await updateDeviceType(req.params.id, req.validated.body);
    return res.json(deviceType);
  } catch (error) {
    return next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const deviceType = await deleteDeviceType(req.params.id);
    return res.json(deviceType);
  } catch (error) {
    return next(error);
  }
}
