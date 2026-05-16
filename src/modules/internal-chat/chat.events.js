import { getSocket } from "../../socket/socket.js";

export function emitNewMessage(message) {
  const io = getSocket();

  io.to(`chat-room:${message.room}`).emit(
    "chat:new-message",
    message
  );
}

export function emitMessageRead(data) {
  const io = getSocket();

  io.to(`chat-room:${data.room}`).emit(
    "chat:message-read",
    data
  );
}
