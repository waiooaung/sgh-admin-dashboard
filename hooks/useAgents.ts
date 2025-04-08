import { useMemo } from "react";
import { useApi } from "./useApi";
import { Agent } from "@/types/agent";

interface AgentsApiResponse {
  statusCode: number;
  success: boolean;
  data: Agent[];
}

export const useAgents = (tenantId: number | undefined) => {
  const { data, error } = useApi<AgentsApiResponse>(
    tenantId ? `/agents?limit=100&tenantId=${tenantId}` : null,
  );

  const agents = useMemo(() => data?.data || [], [data]);

  return {
    agents,
    isError: !!error,
  };
};
