import {
  getEmailsStats,
  getUniqueNameandPass,
  premiumCredentials,
  uploadPremiumEmail,
} from "@/api/dashboard";
import { getFaqList } from "@/api/faq";
import { getInsList } from "@/api/ins";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
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

export const usePremiumCredentails = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["premiumCredentials", token],
    queryFn: () => premiumCredentials(token),
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

export const useUploadPremiumEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: FormData; token: string }) =>
      uploadPremiumEmail(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries([
          "premiumCredentials",
          variables.token,
        ] as any);
      } else {
        toast.error(data?.response?.data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
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
