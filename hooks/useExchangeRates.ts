import { useMemo } from "react";
import { useApi } from "./useApi";
import { ExchangeRateApiResponse } from "@/types/exchangeRate";

export const useExchangeRates = (queryString: URLSearchParams) => {
  const { data, error, isLoading, mutate } = useApi<ExchangeRateApiResponse>(
    `/exchange-rates?${queryString}`,
  );

  const exchangeRates = useMemo(() => data?.data || [], [data]);
  const meta = useMemo(() => data?.meta || null, [data]);

  return {
    exchangeRates,
    meta,
    isError: !!error,
    isLoading,
    mutate,
  };
};
