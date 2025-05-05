import { useMemo } from "react";
import { useApi } from "./useApi";
import { Agent } from "@/types/agent";
import { MetaData } from "@/types/meta-data";

interface AgentsApiResponse {
  statusCode: number;
  success: boolean;
  data: Agent[];
  meta: MetaData;
}

export const useAgents = (queryString: URLSearchParams) => {
  const { data, error, isLoading, mutate } = useApi<AgentsApiResponse>(
    `/agents?${queryString}`,
  );

  const agents = useMemo(() => data?.data || [], [data]);
  const meta = useMemo(() => data?.meta || null, [data]);

  return {
    agents,
    meta,
    isError: !!error,
    isLoading,
    mutate,
  };
};
