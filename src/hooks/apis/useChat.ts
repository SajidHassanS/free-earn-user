import { getMessages, getUnreadCount, getUsersList } from "@/api/chat";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetAdminsList = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["allAdmins", token],
    queryFn: () => getUsersList(token),
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  } as UseQueryOptions);
};

export const useAdminMessagesHistory = (uuid: string, token: string) => {
  return useQuery<any, Error>({
    queryKey: ["messageHistory", uuid, token],
    queryFn: () => getMessages(uuid, token),
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
    enabled: !!uuid,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  } as UseQueryOptions);
};

export const useGetUnreadMessageCount = (uuid: string, token: string) => {
  return useQuery<any, Error>({
    queryKey: ["unreadMessageCount", uuid, token],
    queryFn: () => getUnreadCount(uuid, token),
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
    enabled: !!uuid,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  } as UseQueryOptions);
};
