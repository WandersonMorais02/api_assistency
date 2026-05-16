import { Server } from "socket.io";

let io = null;

export function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", socket => {
    console.log(
      "Cliente conectado:",
      socket.id
    );

    /**
     * =================================
     * SERVICE ORDERS
     * =================================
     */

    socket.on(
      "join-service-order",
      protocol => {
        if (protocol) {
          socket.join(
            `service-order:${protocol}`
          );

          console.log(
            `[SOCKET] ${socket.id} entrou na OS ${protocol}`
          );
        }
      }
    );

    socket.on(
      "leave-service-order",
      protocol => {
        if (protocol) {
          socket.leave(
            `service-order:${protocol}`
          );

          console.log(
            `[SOCKET] ${socket.id} saiu da OS ${protocol}`
          );
        }
      }
    );

    /**
     * =================================
     * INTERNAL CHAT
     * =================================
     */

    socket.on(
      "join-chat-room",
      roomId => {
        if (roomId) {
          socket.join(
            `chat-room:${roomId}`
          );

          console.log(
            `[SOCKET] ${socket.id} entrou na sala ${roomId}`
          );
        }
      }
    );

    socket.on(
      "leave-chat-room",
      roomId => {
        if (roomId) {
          socket.leave(
            `chat-room:${roomId}`
          );

          console.log(
            `[SOCKET] ${socket.id} saiu da sala ${roomId}`
          );
        }
      }
    );

    /**
     * =================================
     * TYPING EVENTS
     * =================================
     */

    socket.on(
      "chat:typing",
      data => {
        if (!data?.room) return;

        socket.to(
          `chat-room:${data.room}`
        ).emit(
          "chat:typing",
          {
            room: data.room,
            user: data.user,
          }
        );
      }
    );

    socket.on(
      "chat:stop-typing",
      data => {
        if (!data?.room) return;

        socket.to(
          `chat-room:${data.room}`
        ).emit(
          "chat:stop-typing",
          {
            room: data.room,
            user: data.user,
          }
        );
      }
    );

    /**
     * =================================
     * USER ONLINE/OFFLINE
     * =================================
     */

    socket.on(
      "user:online",
      userId => {
        if (userId) {
          socket.broadcast.emit(
            "user:online",
            {
              userId,
            }
          );
        }
      }
    );

    socket.on(
      "user:offline",
      userId => {
        if (userId) {
          socket.broadcast.emit(
            "user:offline",
            {
              userId,
            }
          );
        }
      }
    );

    /**
     * =================================
     * DISCONNECT
     * =================================
     */

    socket.on(
      "disconnect",
      () => {
        console.log(
          "Cliente desconectado:",
          socket.id
        );
      }
    );
  });

  return io;
}

export function getSocket() {
  if (!io) {
    throw new Error(
      "Socket.IO não inicializado"
    );
  }

  return io;
}
