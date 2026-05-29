import {
  createRoom,
  listRooms,
  findRoomById,
  sendMessage,
  listMessages,
  markMessageAsRead,
} from "./chat.service.js";

export async function create(req, res, next) {
  try {
    const room = await createRoom(
      req.validated.body,
      req.user.id
    );

    return res.status(201).json(room);
  } catch (error) {
    return next(error);
  }
}

export async function index(req, res, next) {
  try {
    const rooms = await listRooms(req.user);
    return res.json(rooms);
  } catch (error) {
    return next(error);
  }
}

export async function show(req, res, next) {
  try {
    const room = await findRoomById(
      req.params.id,
      req.user.id
    );

    return res.json(room);
  } catch (error) {
    return next(error);
  }
}

export async function createMessage(
  req,
  res,
  next
) {
  try {
    const message = await sendMessage(
      req.validated.body,
      req.user
    );

    return res.status(201).json(message);
  } catch (error) {
    return next(error);
  }
}

export async function indexMessages(
  req,
  res,
  next
) {
  try {
    const messages =
      await listMessages(
        req.params.id,
        req.query,
        req.user
      );

    return res.json(messages);
  } catch (error) {
    return next(error);
  }
}

export async function readMessage(
  req,
  res,
  next
) {
  try {
    const message =
      await markMessageAsRead(
        req.params.id,
        req.user.id
      );

    return res.json(message);
  } catch (error) {
    return next(error);
  }
}
