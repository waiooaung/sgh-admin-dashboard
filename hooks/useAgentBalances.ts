import { useMemo } from "react";
import { useApi } from "./useApi";
import { AgentBalanceApiResponse } from "@/types/agentBalance";

export const useAgentBalances = (agentId: number, currencyId?: number) => {
  const queryParams = new URLSearchParams();

  if (agentId) queryParams.append("agentId", String(agentId));
  if (currencyId) queryParams.append("currencyId", String(currencyId));

  const { data, error } = useApi<AgentBalanceApiResponse>(
    `/agent-balance?${queryParams}`,
  );

  const agentBalances = useMemo(() => data?.data || [], [data]);

  return {
    agentBalances,
    isError: !!error,
  };
};
