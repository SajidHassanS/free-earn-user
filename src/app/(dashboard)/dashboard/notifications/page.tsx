"use client";

import { useContextConsumer } from "@/context/Context";
import { Toaster } from "react-hot-toast";
import {
  useGetAllNotifications,
  useMarkAllReadNotifications,
  useReadNotificatoin,
} from "@/hooks/apis/useNotifications";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { format } from "date-fns";
import { useState } from "react";
import {
  BellDot,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Notifications = () => {
  const { token } = useContextConsumer();

  const { data, isLoading } = useGetAllNotifications(token);
  const { mutate: readNotifications, isPending: reading } =
    useReadNotificatoin();
  const { mutate: markAllRead, isPending: markingAll } =
    useMarkAllReadNotifications();

  const notifications = data?.data || [];
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const handleClick = (notification: any) => {
    setSelectedNotification(notification);
    // need to work on it
    const updatedData = {
      data: {
        ...data,
        uuid: notification?.uuid,
      },
      token,
    };
    readNotifications(updatedData);
  };

  const handleMarkAll = () => {
    if (token) {
      markAllRead({ token });
    }
  };

  const handleBack = () => {
    setSelectedNotification(null);
  };

  return (
    <>
      <Toaster />
      <div className="space-y-6 p-10 rounded-2xl max-w-4xl mx-auto">
        {!selectedNotification ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">Notifications</h2>
              <Button
                size="sm"
                variant="outline"
                onClick={handleMarkAll}
                disabled={markingAll}
                className="text-xs flex items-center gap-2"
              >
                {markingAll ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Marking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Mark All as Read
                  </>
                )}
              </Button>
            </div>

            {isLoading ? (
              <SkeletonCard className="w-full h-40" />
            ) : notifications.length <= 0 ? (
              <p className="text-gray-500">No Notifications Available!</p>
            ) : (
              <div className="grid gap-4">
                {notifications.map((notification: any) => (
                  <div
                    key={notification.uuid}
                    className={cn(
                      "flex items-start gap-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer bg-white dark:bg-zinc-900",
                      !notification.read && "ring-1 ring-primary/20"
                    )}
                    onClick={() => handleClick(notification)}
                  >
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <BellDot className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">
                        {notification.title || "Untitled Notification"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 dark:text-gray-300">
                        {notification.message}
                      </p>
                    </div>
                    <ChevronRight className="text-gray-400 mt-2" />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center text-sm text-primary hover:underline"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Notifications
              </button>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-2">
                {selectedNotification.title || "Untitled Notification"}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                {selectedNotification.message}
              </p>
              <div className="text-sm bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg border dark:border-zinc-700 text-gray-800 dark:text-gray-200 overflow-auto">
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <strong>Created At:</strong>{" "}
                    {format(
                      new Date(selectedNotification.createdAt),
                      "dd MMM yyyy, hh:mm a"
                    )}
                  </div>
                  {selectedNotification.metadata?.duplicateEmails?.length >
                    0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        Duplicate Emails:
                      </h4>
                      <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {selectedNotification.metadata.duplicateEmails.map(
                          (email: string, idx: number) => (
                            <li key={idx}>{email}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
