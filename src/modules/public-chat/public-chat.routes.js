import { Router } from "express";

import {
  start,
  messages,
  send,
} from "./public-chat.controller.js";

import { validate } from "../../core/middlewares/validate.middleware.js";

import {
  startPublicChatSchema,
  publicChatTokenSchema,
  sendPublicMessageSchema,
} from "./public-chat.schema.js";

const publicChatRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Public Chat
 *   description: Atendimento público pelo site
 */

publicChatRoutes.post(
  "/start",
  validate(startPublicChatSchema),
  start
);

publicChatRoutes.get(
  "/:token/messages",
  validate(publicChatTokenSchema),
  messages
);

publicChatRoutes.post(
  "/:token/messages",
  validate(sendPublicMessageSchema),
  send
);

export default publicChatRoutes;
