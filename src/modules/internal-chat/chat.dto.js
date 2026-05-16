export function chatRoomDTO(room) {
  return {
    id: room._id,

    name: room.name,

    type: room.type,

    participants:
      room.participants?.map((participant) => ({
        id: participant._id,
        name: participant.name,
        email: participant.email,
        role: participant.role,
      })) || [],

    createdBy: room.createdBy
      ? {
          id: room.createdBy._id,
          name: room.createdBy.name,
          email: room.createdBy.email,
        }
      : null,

    lastMessage: room.lastMessage
      ? {
          id: room.lastMessage._id,
          content: room.lastMessage.content,
          type: room.lastMessage.type,
          createdAt: room.lastMessage.createdAt,
        }
      : null,

    isActive: room.isActive,

    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
  };
}

export function chatMessageDTO(message) {
  return {
    id: message._id,

    room: message.room,

    sender: message.sender
      ? {
          id: message.sender._id,
          name: message.sender.name,
          email: message.sender.email,
          role: message.sender.role,
        }
      : null,

    type: message.type,

    content: message.content,

    attachments:
      message.attachments?.map((attachment) => ({
        id: attachment._id,
        originalName: attachment.originalName,
        url: attachment.url,
        mimetype: attachment.mimetype,
      })) || [],

    readBy:
      message.readBy?.map((read) => ({
        user: read.user?._id || read.user,
        readAt: read.readAt,
      })) || [],

    metadata: {
      confidence:
        message.metadata?.confidence || null,

      intent:
        message.metadata?.intent || null,

      tokens:
        message.metadata?.tokens || [],
    },

    isEdited: message.isEdited,
    isDeleted: message.isDeleted,

    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
}
