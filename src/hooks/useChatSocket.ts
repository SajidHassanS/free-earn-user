import { useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";

type MessagePayload = {
  content: string;
  senderType: "admin" | "user";
  receiverUuid: string;
  isNotification: boolean;
};

type ReceivedMessage = {
  senderType: string;
  receiverUuid: string;
  content: string;
  [key: string]: any;
};

type MessageCallback = (msg: ReceivedMessage) => void;

export const useChatSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [adminMessages, setUserMessages] = useState<{
    [uuid: string]: ReceivedMessage[];
  }>({});
  const messageCallbackRef = useRef<MessageCallback | null>(null);

  const connectSocket = (token: string) => {
    if (!socketRef.current) {
      const socket = getSocket(token);
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("✅ Connected to socket:", socket.id);
      });

      socket.on("receiveMessage", (msg: ReceivedMessage) => {
        console.log("📥 Received message:", msg);
        setUserMessages((prev) => {
          const updated = { ...prev };
          if (!updated[msg.receiverUuid]) {
            updated[msg.receiverUuid] = [];
          }
          updated[msg.receiverUuid].push(msg);
          return updated;
        });

        if (messageCallbackRef.current) {
          messageCallbackRef.current(msg);
        }
      });

      socket.on("disconnect", () => {
        console.log("❌ Disconnected from socket");
      });
    }
  };

  const subscribeToMessages = (cb: MessageCallback) => {
    messageCallbackRef.current = cb;
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

    setUserMessages((prev) => {
      const updated = { ...prev };
      if (!updated[receiverUuid]) {
        updated[receiverUuid] = [];
      }
      updated[receiverUuid].push(payload);
      return updated;
    });
  };

  return { adminMessages, sendMessage, connectSocket, subscribeToMessages };
};
