import { z } from "zod";

export const updateUserRoleSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID do usuário é obrigatório"),
  }),

  body: z.object({
    role: z.enum(["ADMIN", "TECHNICIAN", "ATTENDANT", "CLIENT"]),
  }),
});
