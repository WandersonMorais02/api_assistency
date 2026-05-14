import { z } from "zod";

const jobTypes = ["FULL_TIME", "PART_TIME", "FREELANCE", "INTERNSHIP"];
const applicationStatus = ["PENDING", "REVIEWING", "APPROVED", "REJECTED"];

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Título precisa ter pelo menos 3 caracteres"),
    description: z.string().min(10, "Descrição precisa ter pelo menos 10 caracteres"),

    requirements: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),

    location: z.string().optional(),
    type: z.enum(jobTypes).optional(),

    image: z.string().optional(),

    isPublished: z.coerce.boolean().optional(),
  }),
});

export const updateJobSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID da vaga é obrigatório"),
  }),

  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),

    requirements: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),

    location: z.string().optional(),
    type: z.enum(jobTypes).optional(),

    image: z.string().optional(),

    isPublished: z.coerce.boolean().optional(),
    isActive: z.coerce.boolean().optional(),
  }),
});

export const applyJobSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID da vaga é obrigatório"),
  }),

  body: z.object({
    name: z.string().min(3, "Nome precisa ter pelo menos 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    phone: z.string().min(8, "Telefone é obrigatório"),
    message: z.string().optional(),
    resume: z.string().optional(),
  }),
});

export const updateApplicationStatusSchema = z.object({
  params: z.object({
    jobId: z.string().min(1, "ID da vaga é obrigatório"),
    applicationId: z.string().min(1, "ID da candidatura é obrigatório"),
  }),

  body: z.object({
    status: z.enum(applicationStatus),
  }),
});

export const jobIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID da vaga é obrigatório"),
  }),
});
