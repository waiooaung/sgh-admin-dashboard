import { useMemo } from "react";
import { useApi } from "./useApi";
import { SupplierBalanceApiResponse } from "@/types/supplierBalance";

export const useSupplierBalances = (
  supplierId: number,
  currencyId?: number,
) => {
  const queryParams = new URLSearchParams();

  if (supplierId) queryParams.append("supplierId", String(supplierId));
  if (currencyId) queryParams.append("currencyId", String(currencyId));

  const { data, error } = useApi<SupplierBalanceApiResponse>(
    `/supplier-balance?${queryParams}`,
  );

  const supplierBalances = useMemo(() => data?.data || [], [data]);

  return {
    supplierBalances,
    isError: !!error,
  };
};
