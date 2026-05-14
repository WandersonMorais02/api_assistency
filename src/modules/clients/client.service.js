import { Client } from "./client.model.js";

import { clientDTO } from "./client.dto.js";

import { AppError } from "../../core/errors/app-error.js";

import {
  getPaginationParams,
  buildPaginationResponse,
} from "../../core/utils/pagination.js";

import { paginatedDTO } from "../../core/dtos/paginated.dto.js";

export async function createClient(data) {
  const client = await Client.create(data);

  return clientDTO(client);
}

export async function listClients(query = {}) {
  const { page, limit, skip } = getPaginationParams(query);

  const filter = {
    isActive: true,
  };

  if (query.search) {
    filter.$or = [
      { name: new RegExp(query.search, "i") },
      { email: new RegExp(query.search, "i") },
      { phone: new RegExp(query.search, "i") },
      { cpf: new RegExp(query.search, "i") },
    ];
  }

  const [data, total] = await Promise.all([
    Client.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Client.countDocuments(filter),
  ]);

  const result = buildPaginationResponse({
    data,
    total,
    page,
    limit,
  });

  return paginatedDTO(result, clientDTO);
}

export async function findClientById(id) {
  const client = await Client.findById(id);

  if (!client) {
    throw new AppError("Cliente não encontrado", 404);
  }

  return clientDTO(client);
}

export async function updateClient(id, data) {
  const client = await Client.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!client) {
    throw new AppError("Cliente não encontrado", 404);
  }

  return clientDTO(client);
}

export async function deleteClient(id) {
  const client = await Client.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!client) {
    throw new AppError("Cliente não encontrado", 404);
  }

  return clientDTO(client);
}
