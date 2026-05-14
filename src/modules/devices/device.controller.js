import {
  createDevice,
  listDevices,
  findDeviceById,
  updateDevice,
  deleteDevice,
} from "./device.service.js";

export async function create(req, res, next) {
  try {
    const device = await createDevice(req.validated.body);
    return res.status(201).json(device);
  } catch (error) {
    return next(error);
  }
}

export async function index(req, res, next) {
  try {
    const devices = await listDevices(req.query);

    return res.json(devices);
  } catch (error) {
    return next(error);
  }
}

export async function show(req, res, next) {
  try {
    const device = await findDeviceById(req.params.id);
    return res.json(device);
  } catch (error) {
    return next(error);
  }
}

export async function update(req, res, next) {
  try {
    const device = await updateDevice(req.params.id, req.validated.body);
    return res.json(device);
  } catch (error) {
    return next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const device = await deleteDevice(req.params.id);
    return res.json(device);
  } catch (error) {
    return next(error);
  }
}
