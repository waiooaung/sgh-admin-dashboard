import { useMemo } from "react";
import { useApi } from "./useApi";
import { ExchangeRateApiResponse } from "@/types/exchangeRate";

export const useExchangeRates = (tenantId: number | undefined) => {
  const { data, error, isLoading } = useApi<ExchangeRateApiResponse>(
    tenantId ? `/exchange-rates?limit=100&tenantId=${tenantId}` : null,
  );

  const exchangeRates = useMemo(() => data?.data || [], [data]);
  const meta = useMemo(() => data?.meta, [data]);

  return {
    exchangeRates,
    meta,
    isError: !!error,
    isLoading,
  };
};
