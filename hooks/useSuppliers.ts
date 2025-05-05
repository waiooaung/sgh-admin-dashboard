import { useMemo } from "react";
import { useApi } from "./useApi";
import { Supplier } from "@/types/supplier";
import { MetaData } from "@/types/meta-data";

interface SuppliersApiResponse {
  statusCode: number;
  success: boolean;
  data: Supplier[];
  meta: MetaData;
}

export const useSuppliers = (queryString: URLSearchParams) => {
  const { data, error, isLoading, mutate } = useApi<SuppliersApiResponse>(
    `/suppliers?${queryString}`,
  );

  const suppliers = useMemo(() => data?.data || [], [data]);
  const meta = useMemo(() => data?.meta || null, [data]);

  return {
    suppliers,
    meta,
    isError: !!error,
    isLoading,
    mutate,
  };
};
