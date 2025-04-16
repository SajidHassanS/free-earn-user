import { useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";

type MessagePayload = {
  content: string;
  senderType: "user";
  receiverUuid: string;
  isNotification: boolean;
};
export const useChatSocket = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const connectSocket = (token: string) => {
    if (!socketRef.current) {
      const socket = getSocket(token);
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Connected to socket:", socket.id);
      });

      socket.on("receiveMessage", (msg: any) => {
        console.log("Message received:", msg);
        setMessages((prev) => [...prev, `${msg.senderType}: ${msg.content}`]);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from socket");
      });
    }
  };

  const sendMessage = (
    token: string,
    receiverUuid: string,
    content: string
  ) => {
    if (!socketRef.current) {
      connectSocket(token);
    }

    const payload: MessagePayload = {
      content,
      senderType: "user",
      receiverUuid,
      isNotification: false,
    };

    console.log("📤 Sending message:", payload);
    socketRef.current?.emit("sendMessage", payload);
    setMessages((prev) => [...prev, `${content}`]);
  };

  return { messages, sendMessage, connectSocket };
};
