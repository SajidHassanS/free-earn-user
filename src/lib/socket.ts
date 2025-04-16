import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token: string): Socket => {
  if (!socket) {
    socket = io("https://b3a0-37-111-135-234.ngrok-free.app", {
      query: { token },
      transports: ["websocket"],
    });
  }

  return socket;
};
