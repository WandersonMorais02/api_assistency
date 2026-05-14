import { z } from "zod";

import {
  toId,
  toDate,
  removeEmptyFields,
} from "../../core/dtos/base.dto.js";

const clientOutputSchema = z.object({
  id: z.string(),

  name: z.string(),

  email: z.string().nullable().optional(),

  phone: z.string().nullable().optional(),

  cpf: z.string().nullable().optional(),

  notes: z.string().nullable().optional(),

  isActive: z.boolean(),

  createdAt: z.string().nullable(),

  updatedAt: z.string().nullable(),
});

export function clientDTO(client) {
  if (!client) return null;

  const data = removeEmptyFields({
    id: toId(client),

    name: client.name,

    email: client.email || null,

    phone: client.phone || null,

    cpf: client.cpf || null,

    notes: client.notes || null,

    isActive: client.isActive,

    createdAt: toDate(client.createdAt),

    updatedAt: toDate(client.updatedAt),
  });

  return clientOutputSchema.parse(data);
}

export function clientsDTO(clients = []) {
  return clients.map(clientDTO);
}
