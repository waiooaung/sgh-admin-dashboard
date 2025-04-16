import { useMemo } from "react";
import { useApi } from "./useApi";
import { Transaction } from "@/types/transaction";
import { MetaData } from "@/types/meta-data";

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Transaction[];
  meta: MetaData;
}

export const useTransactions = (queryString: URLSearchParams) => {
  const { data, error, isLoading, mutate } = useApi<ApiResponse>(
    `/transactions?${queryString}`,
  );

  const transactionsData = useMemo(() => data?.data || [], [data]);
  const metaData = useMemo(() => data?.meta || null, [data]);

  return {
    transactionsData,
    metaData,
    isError: !!error,
    isLoading,
    mutate,
  };
};
