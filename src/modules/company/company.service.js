import { Company } from "./company.model.js";
import { companyDTO } from "./company.dto.js";

import { Attachment } from "../attachments/attachment.model.js";

import { AppError } from "../../core/errors/app-error.js";

export async function getCompany() {
  const company = await Company.findOne({ isActive: true }).populate("logo");

  if (!company) {
    return null;
  }

  return companyDTO(company);
}

export async function upsertCompany(data) {
  if (data.logo) {
    const logo = await Attachment.findById(data.logo);

    if (!logo) {
      throw new AppError("Logo não encontrada", 404);
    }

    if (logo.category !== "image") {
      throw new AppError("Logo precisa ser uma imagem", 400);
    }
  }

  const currentCompany = await Company.findOne();

  if (!currentCompany) {
    const company = await Company.create({
      ...data,
      isActive: data.isActive ?? true,
    });

    const populatedCompany = await Company.findById(company._id).populate("logo");

    return companyDTO(populatedCompany);
  }

  Object.assign(currentCompany, data);

  await currentCompany.save();

  const populatedCompany = await Company.findById(currentCompany._id).populate(
    "logo"
  );

  return companyDTO(populatedCompany);
}
