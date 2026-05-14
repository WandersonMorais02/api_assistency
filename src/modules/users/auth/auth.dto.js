import { z } from "zod";

import {
  toId,
  toDate,
  removeEmptyFields,
} from "../../../core/dtos/base.dto.js";

const authUserSchema = z.object({
  id: z.string(),

  name: z.string(),

  email: z.string().email(),

  role: z.string(),

  isActive: z.boolean(),

  createdAt: z.string().nullable(),
});

const authResponseSchema = z.object({
  user: authUserSchema,
  token: z.string(),
});

function authUserDTO(user) {
  return removeEmptyFields({
    id: toId(user),

    name: user.name,

    email: user.email,

    role: user.role,

    isActive: user.isActive,

    createdAt: toDate(user.createdAt),
  });
}

export function authDTO({ user, token }) {
  const data = {
    user: authUserDTO(user),
    token,
  };

  return authResponseSchema.parse(data);
}
