import { useMemo } from "react";
import { useApi } from "./useApi";
import { Currency } from "@/types/currency";

interface CurrencyApiResponse {
  statusCode: number;
  success: boolean;
  data: Currency[];
}

export const useCurrencies = (tenantId: number | undefined) => {
  const { data, error } = useApi<CurrencyApiResponse>(
    tenantId ? `/currencies?limit=100&tenantId=${tenantId}` : null,
  );

  const currencies = useMemo(() => data?.data || [], [data]);

  return {
    currencies,
    isError: !!error,
  };
};
