export type AgentBalance = {
  id: number;
  agentId: number;
  currencyId: number;
  receivedAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type AgentBalanceApiResponse = {
  statusCode: number;
  success: boolean;
  data: AgentBalance[];
};
