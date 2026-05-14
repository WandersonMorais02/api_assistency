import fs from "fs/promises";
import path from "path";

import { Product } from "../products/product.model.js";
import { Attachment } from "./attachment.model.js";
import { Device } from "../devices/device.model.js";
import { ServiceOrder } from "../service-orders/service-order.model.js";

import { attachmentDTO } from "./attachment.dto.js";

import { createAuditLog } from "../audit-logs/audit-log.service.js";

import { AppError } from "../../core/errors/app-error.js";
import { env } from "../../config/env.config.js";
import { optimizeImage } from "../../core/upload/image-processor.js";

import {
  getPaginationParams,
  buildPaginationResponse,
} from "../../core/utils/pagination.js";

import { paginatedDTO } from "../../core/dtos/paginated.dto.js";

function getDestinationFolder(context, category) {
  const folders = {
    PRODUCT_IMAGE: "uploads/images/products",
    DEVICE_IMAGE: "uploads/images/devices",
    JOB_IMAGE: "uploads/images/jobs",

    JOB_RESUME: "uploads/documents/job-resumes",
    CONSENT_DOCUMENT: "uploads/documents/consent-terms",

    CONSENT_AUDIO: "uploads/audios/consent-records",
    CONSENT_VIDEO: "uploads/videos/consent-records",

    SERVICE_ORDER_ATTACHMENT: `uploads/${category}s/service-orders`,
  };

  return folders[context];
}

async function linkAttachmentToRelatedEntity({
  attachmentId,
  context,
  relatedTo,
}) {
  if (!relatedTo) return;

  if (context === "DEVICE_IMAGE") {
    const device = await Device.findByIdAndUpdate(
      relatedTo,
      {
        $addToSet: {
          images: attachmentId,
        },
      },
      { new: true }
    );

    if (!device) {
      throw new AppError(
        "Equipamento relacionado não encontrado",
        404
      );
    }

    return;
  }

  if (context === "PRODUCT_IMAGE") {
    const product = await Product.findByIdAndUpdate(
      relatedTo,
      {
        $addToSet: {
          images: attachmentId,
        },
      },
      { new: true }
    );

    if (!product) {
      throw new AppError(
        "Produto relacionado não encontrado",
        404
      );
    }

    return;
  }

  if (context === "JOB_IMAGE") {
    const { Job } = await import("../jobs/job.model.js");

    const job = await Job.findByIdAndUpdate(
      relatedTo,
      {
        image: attachmentId,
      },
      { new: true }
    );

    if (!job) {
      throw new AppError(
        "Vaga relacionada não encontrada",
        404
      );
    }

    return;
  }

  if (
    context === "SERVICE_ORDER_ATTACHMENT" ||
    context === "CONSENT_DOCUMENT" ||
    context === "CONSENT_AUDIO" ||
    context === "CONSENT_VIDEO"
  ) {
    const serviceOrder = await ServiceOrder.findByIdAndUpdate(
      relatedTo,
      {
        $addToSet: {
          attachments: attachmentId,
        },
      },
      { new: true }
    );

    if (!serviceOrder) {
      throw new AppError(
        "Ordem de serviço relacionada não encontrada",
        404
      );
    }
  }
}

export async function createAttachment({
  file,
  data,
  userId,
}) {
  if (!file) {
    throw new AppError(
      "Arquivo não enviado",
      400
    );
  }

  const destinationFolder = getDestinationFolder(
    data.context,
    file.category
  );

  if (!destinationFolder) {
    throw new AppError(
      "Contexto de upload inválido",
      400
    );
  }

  let finalFile;

  if (file.category === "image") {
    finalFile = await optimizeImage({
      inputPath: file.path,
      outputFolder: destinationFolder,
    });
  } else {
    await fs.mkdir(destinationFolder, {
      recursive: true,
    });

    const finalPath = path.join(
      destinationFolder,
      file.filename
    );

    await fs.rename(file.path, finalPath);

    finalFile = {
      filename: file.filename,
      path: finalPath,
      mimetype: file.mimetype,
    };
  }

  const url = `${env.appUrl}/${finalFile.path}`;

  const attachment = await Attachment.create({
    originalName: file.originalname,
    filename: finalFile.filename,
    path: finalFile.path,
    url,
    mimetype: finalFile.mimetype,
    size: file.size,
    category: file.category,
    context: data.context,
    relatedTo: data.relatedTo,
    uploadedBy: userId,
  });

  await linkAttachmentToRelatedEntity({
    attachmentId: attachment._id,
    context: data.context,
    relatedTo: data.relatedTo,
  });

  await createAuditLog({
    action: "ATTACHMENT_CREATED",
    entity: "Attachment",
    entityId: attachment._id,
    performedBy: userId,
    changes: {
      isActive: {
        from: null,
        to: true,
      },
    },
    metadata: {
      originalName: attachment.originalName,
      filename: attachment.filename,
      mimetype: attachment.mimetype,
      category: attachment.category,
      context: attachment.context,
      relatedTo: attachment.relatedTo
        ? String(attachment.relatedTo)
        : null,
      size: attachment.size,
    },
  });

  return findAttachmentById(attachment._id);
}

export async function listAttachments(query = {}) {
  const { page, limit, skip } =
    getPaginationParams(query);

  const filter = {
    isActive: true,
  };

  if (query.context) {
    filter.context = query.context;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.relatedTo) {
    filter.relatedTo = query.relatedTo;
  }

  if (query.search) {
    filter.$or = [
      {
        originalName: new RegExp(
          query.search,
          "i"
        ),
      },
      {
        filename: new RegExp(
          query.search,
          "i"
        ),
      },
      {
        mimetype: new RegExp(
          query.search,
          "i"
        ),
      },
    ];
  }

  const [data, total] = await Promise.all([
    Attachment.find(filter)
      .populate(
        "uploadedBy",
        "name email role"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Attachment.countDocuments(filter),
  ]);

  const result = buildPaginationResponse({
    data,
    total,
    page,
    limit,
  });

  return paginatedDTO(
    result,
    attachmentDTO
  );
}

export async function findAttachmentById(id) {
  const attachment =
    await Attachment.findById(id).populate(
      "uploadedBy",
      "name email role"
    );

  if (!attachment) {
    throw new AppError(
      "Anexo não encontrado",
      404
    );
  }

  return attachmentDTO(attachment);
}

export async function deleteAttachment(
  id,
  userId
) {
  const attachment =
    await Attachment.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).populate(
      "uploadedBy",
      "name email role"
    );

  if (!attachment) {
    throw new AppError(
      "Anexo não encontrado",
      404
    );
  }

  await createAuditLog({
    action: "ATTACHMENT_DELETED",
    entity: "Attachment",
    entityId: attachment._id,
    performedBy: userId,
    changes: {
      isActive: {
        from: true,
        to: false,
      },
    },
    metadata: {
      originalName: attachment.originalName,
      filename: attachment.filename,
      mimetype: attachment.mimetype,
      category: attachment.category,
      context: attachment.context,
      relatedTo: attachment.relatedTo
        ? String(attachment.relatedTo)
        : null,
    },
  });

  return attachmentDTO(attachment);
}
