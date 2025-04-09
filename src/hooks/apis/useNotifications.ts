import {
  getNotificationList,
  getUnreadNotificationCount,
  markAllRead,
  readNotification,
} from "@/api/notifications";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetAllNotifications = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["allNotifications", token],
    queryFn: () => getNotificationList(token),
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

export const useGetUnreadNotifications = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["allUnreadNotifications", token],
    queryFn: () => getUnreadNotificationCount(token),
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

export const useReadNotificatoin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      readNotification(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries([
          "allNotifications",
          variables.token,
        ] as any);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useMarkAllReadNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token }: { token: string }) => markAllRead(token),
    onSuccess: (data: any, variables: { token: string }) => {
      if (data?.success) {
        toast.success(data?.message);
        queryClient.invalidateQueries([
          "allNotifications",
          variables.token,
        ] as any);
      } else {
        toast.error(data?.response?.data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
};
