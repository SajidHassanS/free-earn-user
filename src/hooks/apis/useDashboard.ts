import { getEmailsStats, getUniqueNameandPass } from "@/api/dashboard";
import { getFaqList } from "@/api/faq";
import { getInsList } from "@/api/ins";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetNameandPass = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["getUniqueNameandPass", token],
    queryFn: () => getUniqueNameandPass(token),
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

export const useGetEmailStats = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["getEmailsStats", token],
    queryFn: () => getEmailsStats(token),
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

export const useGetFaqList = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["allFaqs", token],
    queryFn: () => getFaqList(token),
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

export const useGetInsList = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["allIns", token],
    queryFn: () => getInsList(token),
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
