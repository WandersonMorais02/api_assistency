import {
  createClient,
  listClients,
  findClientById,
  updateClient,
  deleteClient,
} from "./client.service.js";

export async function create(req, res, next) {
  try {
    const client = await createClient(req.validated.body);
    return res.status(201).json(client);
  } catch (error) {
    return next(error);
  }
}

export async function index(req, res, next) {
  try {
    const clients = await listClients(req.query);
    return res.json(clients);
  } catch (error) {
    return next(error);
  }
}

export async function show(req, res, next) {
  try {
    const client = await findClientById(req.params.id);
    return res.json(client);
  } catch (error) {
    return next(error);
  }
}

export async function update(req, res, next) {
  try {
    const client = await updateClient(req.params.id, req.validated.body);
    return res.json(client);
  } catch (error) {
    return next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const client = await deleteClient(req.params.id);
    return res.json(client);
  } catch (error) {
    return next(error);
  }
}
