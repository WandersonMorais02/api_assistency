import jwt from "jsonwebtoken";
import { env } from "../../config/env.config.js";

export function generateToken(payload) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}
