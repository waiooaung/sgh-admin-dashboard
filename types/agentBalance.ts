import { Currency } from "./currency";

export type AgentBalance = {
  id: number;
  agentId: number;
  currencyId: number;
  receivedAmount: number;
  createdAt: Date;
  updatedAt: Date;
  currency: Currency;
};

export type AgentBalanceApiResponse = {
  statusCode: number;
  success: boolean;
  data: AgentBalance[];
};
