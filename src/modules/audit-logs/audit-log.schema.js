import { z } from "zod";

export const auditLogIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID do log é obrigatório"),
  }),
});
