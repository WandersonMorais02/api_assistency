import { z } from "zod";

export const createDeviceSchema = z.object({
  body: z.object({
    client: z.string().min(1, "Cliente é obrigatório"),
    deviceType: z.string().min(1, "Tipo de equipamento é obrigatório"),

    brand: z.string().min(1, "Marca é obrigatória"),
    model: z.string().min(1, "Modelo é obrigatório"),

    serialNumber: z.string().optional(),
    imei: z.string().optional(),
    color: z.string().optional(),

    accessories: z.array(z.string()).optional(),

    reportedIssue: z.string().min(3, "Problema relatado é obrigatório"),

    physicalCondition: z.string().optional(),
    passwordOrPattern: z.string().optional(),
    observations: z.string().optional(),
  }),
});

export const updateDeviceSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID do equipamento é obrigatório"),
  }),

  body: z.object({
    client: z.string().optional(),
    deviceType: z.string().optional(),

    brand: z.string().optional(),
    model: z.string().optional(),

    serialNumber: z.string().optional(),
    imei: z.string().optional(),
    color: z.string().optional(),

    accessories: z.array(z.string()).optional(),

    reportedIssue: z.string().optional(),

    physicalCondition: z.string().optional(),
    passwordOrPattern: z.string().optional(),
    observations: z.string().optional(),

    images: z.array(z.string()).optional(),

    isActive: z.boolean().optional(),
  }),
});

export const deviceIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID do equipamento é obrigatório"),
  }),
});
