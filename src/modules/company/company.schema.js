import { z } from "zod";

const addressSchema = z
  .object({
    street: z.string().optional(),
    number: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  })
  .optional();

const socialLinksSchema = z
  .object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    tiktok: z.string().optional(),
    website: z.string().optional(),
  })
  .optional();

export const upsertCompanySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome da assistência é obrigatório"),

    document: z.string().optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),

    address: addressSchema,

    openingHours: z.string().optional(),

    logo: z.string().optional(),

    consentTerms: z.string().optional(),
    warrantyPolicy: z.string().optional(),

    socialLinks: socialLinksSchema,

    isActive: z.boolean().optional(),
  }),
});
