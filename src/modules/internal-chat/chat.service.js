import { ChatRoom } from "./chat-room.model.js";
import { ChatMessage } from "./chat-message.model.js";

import {
  emitNewMessage,
  emitMessageRead,
} from "./chat.events.js";

import {
  chatRoomDTO,
  chatMessageDTO,
} from "./chat.dto.js";

import { processBotMessage } from "../../core/bot/bot-engine.js";

import { User } from "../users/user.model.js";
import { Attachment } from "../attachments/attachment.model.js";

import { AppError } from "../../core/errors/app-error.js";

import {
  getPaginationParams,
  buildPaginationResponse,
} from "../../core/utils/pagination.js";

import { paginatedDTO } from "../../core/dtos/paginated.dto.js";

function shouldTriggerBot({ room, content }) {
  if (room.type === "BOT") {
    return true;
  }

  return content
    ?.toLowerCase()
    .includes("@bot");
}

async function populateMessage(messageId) {
  return ChatMessage.findById(messageId)
    .populate("sender", "name email role")
    .populate("attachments");
}

function canAccessSupportRoom(user) {
  return ["ADMIN", "ATTENDANT", "TECHNICIAN"].includes(user.role);
}

export async function createRoom(
  data,
  userId
) {
  /**
   * ============================
   * NORMALIZE PARTICIPANTS
   * ============================
   */

  const participants = [
    ...new Set([
      ...(data.participants || []).map(
        String
      ),

      String(userId),
    ]),
  ];

  /**
   * ============================
   * VALIDATE USERS
   * ============================
   */

  const users = await User.find({
    _id: {
      $in: participants,
    },
  });

  if (
    users.length !==
    participants.length
  ) {
    throw new AppError(
      "Um ou mais participantes não foram encontrados",
      404
    );
  }

  /**
   * ============================
   * PRIVATE ROOM RULE
   * ============================
   */

  if (
    data.type === "PRIVATE" &&
    participants.length !== 2
  ) {
    throw new AppError(
      "Chats privados devem possuir 2 participantes",
      400
    );
  }

  /**
   * ============================
   * CREATE ROOM
   * ============================
   */

  const room =
    await ChatRoom.create({
      name: data.name,

      type: data.type,

      participants,

      createdBy: userId,
    });

  const populatedRoom =
    await ChatRoom.findById(
      room._id
    )
      .populate(
        "participants",
        "name email role"
      )
      .populate(
        "createdBy",
        "name email"
      )
      .populate(
        "lastMessage"
      );

  return chatRoomDTO(
    populatedRoom
  );
}

export async function listRooms(user) {
  const filter = {
    isActive: true,
  };

  if (canAccessSupportRoom(user)) {
    filter.$or = [
      {
        participants: user.id,
      },
      {
        type: "SUPPORT",
      },
    ];
  } else {
    filter.participants = user.id;
  }

  const rooms = await ChatRoom.find(filter)
    .populate(
      "participants",
      "name email role"
    )
    .populate(
      "createdBy",
      "name email"
    )
    .populate("lastMessage")
    .sort({
      updatedAt: -1,
    });

  return rooms.map(chatRoomDTO);
}

export async function findRoomById(
  id,
  userId
) {
  const room =
    await ChatRoom.findOne({
      _id: id,

      participants: userId,

      isActive: true,
    })
      .populate(
        "participants",
        "name email role"
      )
      .populate(
        "createdBy",
        "name email"
      )
      .populate(
        "lastMessage"
      );

  if (!room) {
    throw new AppError(
      "Sala não encontrada",
      404
    );
  }

  return chatRoomDTO(room);
}

export async function sendMessage(
  data,
  user
) {
  const userId = user.id;

  /**
   * ============================
   * FIND ROOM
   * ============================
   */

  const room =
    await ChatRoom.findOne({
      _id: data.room,

      participants: userId,

      isActive: true,
    });

  if (!room) {
    throw new AppError(
      "Sala não encontrada",
      404
    );
  }

  /**
   * ============================
   * VALIDATE ATTACHMENTS
   * ============================
   */

  if (data.attachments?.length) {
    const attachments =
      await Attachment.find({
        _id: {
          $in:
            data.attachments,
        },
      });

    if (
      attachments.length !==
      data.attachments.length
    ) {
      throw new AppError(
        "Um ou mais anexos não foram encontrados",
        404
      );
    }
  }

  /**
   * ============================
   * CREATE USER MESSAGE
   * ============================
   */

  const message =
    await ChatMessage.create({
      room: room._id,

      sender: userId,

      type:
        data.type ||
        "TEXT",

      content:
        data.content,

      attachments:
        data.attachments ||
        [],
    });

  room.lastMessage =
    message._id;

  await room.save();

  const populatedMessage =
    await populateMessage(
      message._id
    );

  const messageDTO =
    chatMessageDTO(
      populatedMessage
    );

  emitNewMessage(
    messageDTO
  );

  /**
   * ============================
   * SHOULD TRIGGER BOT
   * ============================
   */

  if (
    !shouldTriggerBot({
      room,

      content:
        data.content,
    })
  ) {
    return messageDTO;
  }

  /**
   * ============================
   * CLEAN BOT TAG
   * ============================
   */

  const cleanContent =
    data.content
      .replace(
        /@bot/gi,
        ""
      )
      .trim();

  /**
   * ============================
   * PROCESS BOT
   * ============================
   */

  const botResult =
    await processBotMessage({
      roomId: room._id,

      message:
        cleanContent ||
        data.content,

      user,
    });

  /**
   * ============================
   * CREATE BOT MESSAGE
   * ============================
   */

  const botMessage =
    await ChatMessage.create({
      room: room._id,

      sender: null,

      type: "BOT",

      content:
        botResult.response,

      attachments: [],

      metadata: {
        confidence:
          botResult.confidence,

        confidenceLevel:
          botResult.confidenceLevel,

        shouldEscalate:
          botResult.shouldEscalate,

        escalation:
          botResult.escalation,

        intent:
          botResult.intent,

        context:
          botResult.context,

        missingFields:
          botResult.missingFields,

        tokens:
          botResult.tokens ||
          [],

        knownTokens:
          botResult.knownTokens ||
          [],

        unknownTokens:
          botResult.unknownTokens ||
          [],
      },
    });

  room.lastMessage =
    botMessage._id;

  await room.save();

  const populatedBotMessage =
    await populateMessage(
      botMessage._id
    );

  const botDTO =
    chatMessageDTO(
      populatedBotMessage
    );

  emitNewMessage(botDTO);

  /**
   * ============================
   * FINAL RESPONSE
   * ============================
   */

  return {
    message: messageDTO,

    bot: botDTO,

    botResult,
  };
}

export async function listMessages(
  roomId,
  query,
  userId
) {
  const room =
    await ChatRoom.findOne({
      _id: roomId,

      participants: userId,

      isActive: true,
    });

  if (!room) {
    throw new AppError(
      "Sala não encontrada",
      404
    );
  }

  const {
    page,
    limit,
    skip,
  } =
    getPaginationParams(
      query
    );

  const [data, total] =
    await Promise.all([
      ChatMessage.find({
        room: roomId,

        isDeleted: false,
      })
        .populate(
          "sender",
          "name email role"
        )
        .populate(
          "attachments"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      ChatMessage.countDocuments(
        {
          room: roomId,

          isDeleted: false,
        }
      ),
    ]);

  const result =
    buildPaginationResponse({
      data,

      total,

      page,

      limit,
    });

  return paginatedDTO(
    result,
    chatMessageDTO
  );
}

export async function markMessageAsRead(
  messageId,
  userId
) {
  const message =
    await ChatMessage.findById(
      messageId
    );

  if (!message) {
    throw new AppError(
      "Mensagem não encontrada",
      404
    );
  }

  const alreadyRead =
    message.readBy.find(
      item =>
        String(item.user) ===
        String(userId)
    );

  if (!alreadyRead) {
    message.readBy.push({
      user: userId,
    });

    await message.save();
  }

  const populatedMessage =
    await populateMessage(
      message._id
    );

  emitMessageRead({
    room: message.room,

    messageId:
      message._id,

    userId,
  });

  return chatMessageDTO(
    populatedMessage
  );
}
