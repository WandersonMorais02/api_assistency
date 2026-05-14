import {
  listAuditLogs,
  findAuditLogById,
} from "./audit-log.service.js";

export async function index(req, res, next) {
  try {
    const logs = await listAuditLogs(req.query);

    return res.json(logs);
  } catch (error) {
    return next(error);
  }
}

export async function show(req, res, next) {
  try {
    const log = await findAuditLogById(req.params.id);

    return res.json(log);
  } catch (error) {
    return next(error);
  }
}
