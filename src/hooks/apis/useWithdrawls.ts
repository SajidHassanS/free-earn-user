import {
  bonusWithdrawRequest,
  getAllWithdrawlsBonusHistory,
  getAllWithdrawlsHistory,
  getWithdrawls,
  getWithdrawlsBonus,
  withdrawRequest,
} from "@/api/withdrawls";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetWithdrawls = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["withdrawals", token],
    queryFn: () => getWithdrawls(token),
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

export const useGetWithdrawlsBonus = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["withdrawalBonus", token],
    queryFn: () => getWithdrawlsBonus(token),
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

export const useGetWithdrawlHistory = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["withdrawalHistory", token],
    queryFn: () => getAllWithdrawlsHistory(token),
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

export const useGetWithdrawlBonusHistory = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["withdrawalBonusHistory", token],
    queryFn: () => getAllWithdrawlsBonusHistory(token),
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

export const useWithdrawRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      methodUuid,
      token,
    }: {
      methodUuid: string;
      token: string;
    }) => withdrawRequest(methodUuid, token),

    onSuccess: (
      data: any,
      variables: { methodUuid: string; token: string }
    ) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries(["withdrawals", variables.token] as any);
      } else {
        toast.error(data?.response?.data?.message || data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message);
    },
  });
};

export const useBonusWithdrawRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      bonusType,
      methodUuid,
    }: {
      token: string;
      bonusType: string;
      methodUuid: string;
    }) => bonusWithdrawRequest(token, bonusType, methodUuid),
    onSuccess: (
      data: any,
      variables: { token: string; bonusType: string; methodUuid: string }
    ) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries([
          "withdrawalBonus",
          variables.token,
        ] as any);
      } else {
        toast.error(data?.response?.data?.message || data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};
