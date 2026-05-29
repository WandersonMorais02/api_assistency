import crypto from "crypto";

import { ChatRoom } from "../internal-chat/chat-room.model.js";
import { ChatMessage } from "../internal-chat/chat-message.model.js";

import {
  chatRoomDTO,
  chatMessageDTO,
} from "../internal-chat/chat.dto.js";

import { emitNewMessage } from "../internal-chat/chat.events.js";

import { AppError } from "../../core/errors/app-error.js";

import { processBotMessage } from "../../core/bot/bot-engine.js";

function createPublicToken() {
  return crypto.randomBytes(32).toString("hex");
}

async function findRoomByToken(token) {
  const room = await ChatRoom.findOne({
    publicToken: token,
    type: "SUPPORT",
    isActive: true,
  });

  if (!room) {
    throw new AppError("Atendimento não encontrado", 404);
  }

  return room;
}

async function createBotReply({ room, message, customer }) {
  const botResult = await processBotMessage({
    roomId: room._id,
    message,
    user: {
      id: null,
      name: customer?.name || "Cliente",
      role: "CLIENT",
    },
  });

  const botMessage = await ChatMessage.create({
    room: room._id,
    sender: null,
    type: "BOT",
    content: botResult.response,
    attachments: [],
    metadata: {
      confidence: botResult.confidence,
      intent: botResult.intent,
      tokens: botResult.tokens || [],
    },
  });

  room.lastMessage = botMessage._id;

  if (botResult.shouldEscalate) {
    room.status = "WAITING";
  }

  await room.save();

  const populatedBotMessage = await populateMessage(botMessage._id);
  const botDTO = chatMessageDTO(populatedBotMessage);

  emitNewMessage(botDTO);

  return {
    botMessage: botDTO,
    botResult,
  };
}

async function populateRoom(roomId) {
  return ChatRoom.findById(roomId)
    .populate("participants", "name email role")
    .populate("createdBy", "name email")
    .populate("lastMessage");
}

async function populateMessage(messageId) {
  return ChatMessage.findById(messageId)
    .populate("sender", "name email role")
    .populate("attachments");
}

export async function startPublicChat(data) {
  const token = createPublicToken();

  const room = await ChatRoom.create({
    name: `Atendimento - ${data.name}`,
    type: "SUPPORT",
    participants: [],
    createdBy: null,
    publicToken: token,
    customer: {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
    },
    status: "OPEN",
  });

    const message = await ChatMessage.create({
    room: room._id,
    sender: null,
    type: "TEXT",
    content: data.message,
    attachments: [],
    metadata: {
      source: "PUBLIC_CHAT",
      customerName: data.name,
      customerPhone: data.phone,
      customerEmail: data.email || null,
    },
  });

  room.lastMessage = message._id;
  await room.save();

  const populatedRoom = await populateRoom(room._id);
  const populatedMessage = await populateMessage(message._id);

  const messageDTO = chatMessageDTO(populatedMessage);

  emitNewMessage(messageDTO);

  const botReply = await createBotReply({
    room,
    message: data.message,
    customer: {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
    },
  });

  return {
    token,
    room: chatRoomDTO(populatedRoom),
    messages: [
      messageDTO,
      botReply.botMessage,
    ],
    botResult: botReply.botResult,
  };
}

export async function listPublicMessages(token) {
  const room = await findRoomByToken(token);

  const messages = await ChatMessage.find({
    room: room._id,
    isDeleted: false,
  })
    .populate("sender", "name email role")
    .populate("attachments")
    .sort({ createdAt: 1 });

  return messages.map(chatMessageDTO);
}

export async function sendPublicMessage(token, data) {
  const room = await findRoomByToken(token);

  const message = await ChatMessage.create({
    room: room._id,
    sender: null,
    type: "TEXT",
    content: data.message,
    attachments: [],
    metadata: {
      source: "PUBLIC_CHAT",
      customerName: room.customer?.name,
      customerPhone: room.customer?.phone,
      customerEmail: room.customer?.email,
    },
  });

  room.lastMessage = message._id;
  room.status = "WAITING";
  await room.save();

  const populatedMessage = await populateMessage(message._id);
  const messageDTO = chatMessageDTO(populatedMessage);

  emitNewMessage(messageDTO);

  const botReply = await createBotReply({
    room,
    message: data.message,
    customer: room.customer,
  });

  return {
    message: messageDTO,
    bot: botReply.botMessage,
    botResult: botReply.botResult,
  };
}
