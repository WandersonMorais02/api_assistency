import { getSocket } from "./socket.js";

export function emitServiceOrderUpdated(serviceOrder) {
  const io = getSocket();

  io.to(`service-order:${serviceOrder.protocol}`).emit(
    "service-order:updated",
    serviceOrder
  );
}
