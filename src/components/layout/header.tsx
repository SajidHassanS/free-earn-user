"use client";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Breadcrumbs } from "../breadcrumbs";
import { UserNav } from "./user-nav";
import { Bell } from "lucide-react";
import { useGetUnreadNotifications } from "@/hooks/apis/useNotifications";
import { useContextConsumer } from "@/context/Context";

export default function Header() {
  const router = useRouter();
  const { token } = useContextConsumer();

  const { data } = useGetUnreadNotifications(token);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 bg-gray-100">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumbs />
        </div>
        <div className="flex items-center gap-3 px-4">
          <div
            className="relative right-2.5 cursor-pointer group"
            onClick={() => router.push("/dashboard/notifications")}
          >
            <Bell className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
              {data?.data?.unreadCount}
            </span>
          </div>
          <UserNav />
        </div>
      </header>
    </>
  );
}
