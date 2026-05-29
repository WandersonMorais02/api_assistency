import {
  startPublicChat,
  listPublicMessages,
  sendPublicMessage,
} from "./public-chat.service.js";

export async function start(req, res, next) {
  try {
    const result = await startPublicChat(req.validated.body);

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function messages(req, res, next) {
  try {
    const result = await listPublicMessages(req.params.token);

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function send(req, res, next) {
  try {
    const result = await sendPublicMessage(
      req.params.token,
      req.validated.body
    );

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}
