import {
  listUsers,
  findUserById,
  updateUserRole,
} from "./user.service.js";

export async function index(req, res, next) {
  try {
    const users = await listUsers(req.query);

    return res.json(users);
  } catch (error) {
    return next(error);
  }
}

export async function show(req, res, next) {
  try {
    const user = await findUserById(req.params.id);

    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

export async function updateRole(req, res, next) {
  try {
    const { role } = req.validated.body;

    const user = await updateUserRole(
      req.params.id,
      role,
      req.user.id
    );

    return res.json(user);
  } catch (error) {
    return next(error);
  }
}
