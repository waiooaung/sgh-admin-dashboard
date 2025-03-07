import axiosInstance from "@/lib/axios-instance";
import fetcher from "@/lib/fetcher";
import { SWRResponse } from "swr";
import useSWR from "swr";
// import useSWRMutation from "swr/mutation";

export const useGetTransactions = (): SWRResponse => {
  return useSWR("/api/transactions", fetcher);
};
