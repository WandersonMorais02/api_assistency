import {
  createAttachment,
  listAttachments,
  findAttachmentById,
  deleteAttachment,
} from "./attachment.service.js";

export async function uploadOne(req, res, next) {
  try {
    const attachment = await createAttachment({
      file: req.file,
      data: req.validated.body,
      userId: req.user?.id,
    });

    return res.status(201).json(attachment);
  } catch (error) {
    return next(error);
  }
}

export async function index(req, res, next) {
  try {
    const attachments = await listAttachments(req.query);
    return res.json(attachments);
  } catch (error) {
    return next(error);
  }
}

export async function show(req, res, next) {
  try {
    const attachment = await findAttachmentById(req.params.id);
    return res.json(attachment);
  } catch (error) {
    return next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const attachment = await deleteAttachment(
      req.params.id,
      req.user.id
    );

    return res.json(attachment);
  } catch (error) {
    return next(error);
  }
}
