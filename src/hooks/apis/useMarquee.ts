import { getMarqueeList } from "@/api/marquee";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetMarqueeList = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["allMarquees", token],
    queryFn: () => getMarqueeList(token),
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
