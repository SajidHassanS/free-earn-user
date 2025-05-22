"use client";

import { useContextConsumer } from "@/context/Context";
import {
  useAdminMessagesHistory,
  useGetAdminsList,
  useMarkAsReadMessage,
} from "@/hooks/apis/useChat";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useEffect, useRef, useState } from "react";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";

export default function ChatBox() {
  const { token } = useContextConsumer();
  const [selectedUserUuid, setSelectedUserUuid] = useState<string>("");
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  const { data: adminList, isLoading: adminLoading } = useGetAdminsList(token);
  const {
    data: messagesHistory,
    isLoading: historyLoading,
    refetch,
  } = useAdminMessagesHistory(selectedUserUuid, token);
  const { mutate: markAllMessageRead } = useMarkAsReadMessage();

  const { adminMessages, sendMessage, connectSocket, subscribeToMessages } =
    useChatSocket();

  const handleAdminSelect = (uuid: string) => {
    setSelectedUserUuid(uuid);
    const payload = {
      data: { uuid },
      token,
    };
    markAllMessageRead(payload);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || !selectedUserUuid) return;

    sendMessage(token, selectedUserUuid, input);
    setInput("");
  };

  useEffect(() => {
    connectSocket(token);
    subscribeToMessages((msg: any) => {
      if (msg.senderType === "user" && msg.senderUuid === selectedUserUuid) {
        refetch();
      }
    });
  }, [token, selectedUserUuid, connectSocket, refetch, subscribeToMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesHistory, adminMessages, selectedUserUuid]);

  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-100px)]  mx-auto border rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
      <div className="w-full lg:w-1/4 max-h-60 lg:max-h-full lg:h-full border-b lg:border-b-0 lg:border-r bg-zinc-50 dark:bg-zinc-800 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-4 text-primary">Admins</h2>
        {adminLoading ? (
          <SkeletonCard className="w-full h-10 mb-2" />
        ) : (
          <ul className="space-y-2">
            {adminList?.data?.map((admin: any) => (
              <li
                key={admin.uuid}
                onClick={() => handleAdminSelect(admin.uuid)}
                className={cn(
                  "cursor-pointer px-4 py-3 rounded-md hover:bg-primary/10 flex items-center justify-between",
                  selectedUserUuid === admin.uuid &&
                    "bg-primary text-white dark:text-white"
                )}
              >
                <span className="truncate">{admin.username}</span>
                {admin.unreadCount > 0 && selectedUserUuid !== admin.uuid && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {admin.unreadCount}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col justify-between p-4 h-full">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {historyLoading ? (
            <SkeletonCard className="w-full h-40" />
          ) : (
            <>
              {messagesHistory?.data?.messages?.map((msg: any, idx: number) => (
                <div
                  key={msg.uuid || idx}
                  className={cn(
                    "max-w-[80%] md:max-w-[70%] p-3 rounded-xl text-sm break-words",
                    msg.senderUsername === "User"
                      ? "ml-auto bg-blue-500 text-white"
                      : "mr-auto bg-gray-200 text-gray-900"
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {(adminMessages[selectedUserUuid] || []).map((msg, idx) => (
                <div
                  key={`socket-msg-${idx}`}
                  className={cn(
                    "max-w-[80%] md:max-w-[70%] p-3 rounded-xl text-sm break-words",
                    msg.senderType === "user"
                      ? "ml-auto bg-blue-500 text-white"
                      : "mr-auto bg-gray-200 text-gray-900"
                  )}
                >
                  {msg.content}
                </div>
              ))}
            </>
          )}
          <div ref={messageEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-stretch sm:items-center gap-2 mt-4 border-t pt-4 mb-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-800 dark:text-white"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition flex items-center justify-center"
          >
            <SendHorizonal className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
