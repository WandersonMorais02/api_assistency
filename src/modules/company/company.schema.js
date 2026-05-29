import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

const addressSchema = z
  .object({
    street: optionalString,
    number: optionalString,
    neighborhood: optionalString,
    city: optionalString,
    state: optionalString,
    zipCode: optionalString,
  })
  .optional();

const socialLinksSchema = z
  .object({
    instagram: optionalString,
    facebook: optionalString,
    tiktok: optionalString,
    website: optionalString,
  })
  .optional();

export const upsertCompanySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome da assistência é obrigatório"),

    document: optionalString,
    phone: optionalString,
    whatsapp: optionalString,
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),

    address: addressSchema,

    openingHours: optionalString,

    logo: optionalString,

    consentTerms: optionalString,
    warrantyPolicy: optionalString,

    socialLinks: socialLinksSchema,

    isActive: z.boolean().optional(),
  }),
});
