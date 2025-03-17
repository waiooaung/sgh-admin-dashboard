export type AgentTransaction = {
  id: number;
  agentId: string;
  transactionId: number;
  amountUSD: number;
  receivedAmountUSD: number;
  amountRemainingUSD: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
