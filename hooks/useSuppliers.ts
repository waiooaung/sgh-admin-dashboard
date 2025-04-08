import { useMemo } from "react";
import { useApi } from "./useApi";
import { Supplier } from "@/types/supplier";

interface SuppliersApiResponse {
  statusCode: number;
  success: boolean;
  data: Supplier[];
}

export const useSuppliers = (tenantId: number | undefined) => {
  const { data, error } = useApi<SuppliersApiResponse>(
    tenantId ? `/suppliers?limit=100&tenantId=${tenantId}` : null,
  );

  const suppliers = useMemo(() => data?.data || [], [data]);

  return {
    suppliers,
    isError: !!error,
  };
};
