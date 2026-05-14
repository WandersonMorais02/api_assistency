import { getDashboardSummary } from "./dashboard.service.js";

export async function summary(req, res, next) {
  try {
    const data = await getDashboardSummary();

    return res.json(data);
  } catch (error) {
    return next(error);
  }
}
