import { getCompany, upsertCompany } from "./company.service.js";

export async function show(req, res, next) {
  try {
    const company = await getCompany();

    return res.json(company);
  } catch (error) {
    return next(error);
  }
}

export async function upsert(req, res, next) {
  try {
    const company = await upsertCompany(req.validated.body);

    return res.json(company);
  } catch (error) {
    return next(error);
  }
}
