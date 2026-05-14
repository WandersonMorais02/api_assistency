import { registerUser, loginUser } from "./auth.service.js";

export async function register(req, res, next) {
  try {
    const data = req.validated.body;

    const result = await registerUser(data);

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const data = req.validated.body;

    const result = await loginUser(data);

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}
