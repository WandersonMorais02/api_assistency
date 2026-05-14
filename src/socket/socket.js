import { Server } from "socket.io";

let io = null;

export function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", socket => {
    console.log("Cliente conectado:", socket.id);

    socket.on("join-service-order", protocol => {
      if (protocol) {
        socket.join(`service-order:${protocol}`);
      }
    });

    socket.on("leave-service-order", protocol => {
      if (protocol) {
        socket.leave(`service-order:${protocol}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });

  return io;
}

export function getSocket() {
  if (!io) {
    throw new Error("Socket.IO não inicializado");
  }

  return io;
}
