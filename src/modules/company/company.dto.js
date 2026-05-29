import { z } from "zod";

import {
  toId,
  toDate,
  removeEmptyFields,
} from "../../core/dtos/base.dto.js";

const logoSchema = z
  .object({
    id: z.string(),
    url: z.string().optional(),
    path: z.string().optional(),
    filename: z.string().optional(),
    originalName: z.string().optional(),
    mimetype: z.string().optional(),
    category: z.string().optional(),
    context: z.string().optional(),
  })
  .nullable()
  .optional();

const addressSchema = z
  .object({
    street: z.string().nullable().optional(),
    number: z.string().nullable().optional(),
    neighborhood: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    zipCode: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

const socialLinksSchema = z
  .object({
    instagram: z.string().nullable().optional(),
    facebook: z.string().nullable().optional(),
    tiktok: z.string().nullable().optional(),
    website: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

const companyOutputSchema = z.object({
  id: z.string(),

  name: z.string(),

  document: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  email: z.string().nullable().optional(),

  address: addressSchema,

  openingHours: z.string().nullable().optional(),

  logo: logoSchema,

  consentTerms: z.string().nullable().optional(),
  warrantyPolicy: z.string().nullable().optional(),

  socialLinks: socialLinksSchema,

  isActive: z.boolean(),

  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

function logoDTO(logo) {
  if (!logo) return null;

  return removeEmptyFields({
    id: toId(logo),
    url: logo.url,
    path: logo.path,
    filename: logo.filename,
    originalName: logo.originalName,
    mimetype: logo.mimetype,
    category: logo.category,
    context: logo.context,
  });
}

export function companyDTO(company) {
  if (!company) return null;

  const data = removeEmptyFields({
    id: toId(company),

    name: company.name,

    document: company.document || null,
    phone: company.phone || null,
    whatsapp: company.whatsapp || null,
    email: company.email || null,

    address: company.address || null,

    openingHours: company.openingHours || null,

    logo: logoDTO(company.logo),

    consentTerms: company.consentTerms || null,
    warrantyPolicy: company.warrantyPolicy || null,

    socialLinks: company.socialLinks || null,

    isActive: company.isActive,

    createdAt: toDate(company.createdAt),
    updatedAt: toDate(company.updatedAt),
  });

  return companyOutputSchema.parse(data);
}
