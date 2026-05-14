import { Job } from "./job.model.js";
import { jobDTO } from "./job.dto.js";

import { Attachment } from "../attachments/attachment.model.js";

import { AppError } from "../../core/errors/app-error.js";
import { generateSlug } from "../../core/utils/generate-slug.js";

import {
  getPaginationParams,
  buildPaginationResponse,
} from "../../core/utils/pagination.js";

import { paginatedDTO } from "../../core/dtos/paginated.dto.js";

export async function createJob(data) {
  const slug = generateSlug(data.title);

  const exists = await Job.findOne({ slug });

  if (exists) {
    throw new AppError("Já existe uma vaga com esse título", 409);
  }

  if (data.image) {
    const image = await Attachment.findById(data.image);

    if (!image) {
      throw new AppError("Imagem da vaga não encontrada", 404);
    }

    if (image.category !== "image") {
      throw new AppError("O anexo da vaga precisa ser uma imagem", 400);
    }
  }

  const job = await Job.create({
    ...data,
    slug,
  });

  return findJobById(job._id);
}

export async function listJobs(query = {}) {
  const { page, limit, skip } = getPaginationParams(query);

  const filter = {
    isActive: true,
  };

  if (query.onlyPublished === "true" || query.onlyPublished === true) {
    filter.isPublished = true;
  }

  if (query.type) {
    filter.type = query.type;
  }

  if (query.search) {
    filter.$or = [
      { title: new RegExp(query.search, "i") },
      { description: new RegExp(query.search, "i") },
      { location: new RegExp(query.search, "i") },
    ];
  }

  const [data, total] = await Promise.all([
    Job.find(filter)
      .populate("image")
      .populate("applications.resume")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Job.countDocuments(filter),
  ]);

  const result = buildPaginationResponse({
    data,
    total,
    page,
    limit,
  });

  return paginatedDTO(result, jobDTO);
}

export async function findJobById(id) {
  const job = await Job.findById(id)
    .populate("image")
    .populate("applications.resume");

  if (!job) {
    throw new AppError("Vaga não encontrada", 404);
  }

  return jobDTO(job);
}

export async function updateJob(id, data) {
  const updateData = { ...data };

  if (data.title) {
    const slug = generateSlug(data.title);

    const exists = await Job.findOne({
      _id: { $ne: id },
      slug,
    });

    if (exists) {
      throw new AppError("Já existe uma vaga com esse título", 409);
    }

    updateData.slug = slug;
  }

  if (data.image) {
    const image = await Attachment.findById(data.image);

    if (!image) {
      throw new AppError("Imagem da vaga não encontrada", 404);
    }

    if (image.category !== "image") {
      throw new AppError("O anexo da vaga precisa ser uma imagem", 400);
    }
  }

  const job = await Job.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("image")
    .populate("applications.resume");

  if (!job) {
    throw new AppError("Vaga não encontrada", 404);
  }

  return jobDTO(job);
}

export async function deleteJob(id) {
  const job = await Job.findByIdAndUpdate(
    id,
    {
      isActive: false,
      isPublished: false,
    },
    { new: true }
  )
    .populate("image")
    .populate("applications.resume");

  if (!job) {
    throw new AppError("Vaga não encontrada", 404);
  }

  return jobDTO(job);
}

export async function applyToJob(id, data) {
  const job = await Job.findOne({
    _id: id,
    isActive: true,
    isPublished: true,
  });

  if (!job) {
    throw new AppError("Vaga não encontrada ou indisponível", 404);
  }

  if (data.resume) {
    const resume = await Attachment.findById(data.resume);

    if (!resume) {
      throw new AppError("Currículo não encontrado", 404);
    }

    if (resume.context !== "JOB_RESUME") {
      throw new AppError("Anexo informado não é um currículo", 400);
    }
  }

  job.applications.push({
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    resume: data.resume,
  });

  await job.save();

  return findJobById(job._id);
}

export async function updateApplicationStatus({
  jobId,
  applicationId,
  status,
}) {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new AppError("Vaga não encontrada", 404);
  }

  const application = job.applications.id(applicationId);

  if (!application) {
    throw new AppError("Candidatura não encontrada", 404);
  }

  application.status = status;

  await job.save();

  return findJobById(job._id);
}
