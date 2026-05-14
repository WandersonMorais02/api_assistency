import {
  findPublicServiceOrderByProtocol,
  approveServiceOrderBudget,
} from "./customer-portal.service.js";

export async function showServiceOrderByProtocol(req, res, next) {
  try {
    const serviceOrder = await findPublicServiceOrderByProtocol(
      req.params.protocol
    );

    return res.json(serviceOrder);
  } catch (error) {
    return next(error);
  }
}

export async function approveBudget(req, res, next) {
  try {
    const serviceOrder = await approveServiceOrderBudget({
      protocol: req.params.protocol,
      approved: req.validated.body.approved,
      customerNote: req.validated.body.customerNote,
    });

    return res.json(serviceOrder);
  } catch (error) {
    return next(error);
  }
}
