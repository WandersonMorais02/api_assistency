import { z } from "zod";

import {
  toId,
  toDate,
  removeEmptyFields,
} from "../../core/dtos/base.dto.js";

const userOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  isActive: z.boolean(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export function userDTO(user) {
  if (!user) return null;

  const data = removeEmptyFields({
    id: toId(user),
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: toDate(user.createdAt),
    updatedAt: toDate(user.updatedAt),
  });

  return userOutputSchema.parse(data);
}

export function usersDTO(users = []) {
  return users.map(userDTO);
}
