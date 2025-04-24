import { Agent } from "./agent";
import { Currency } from "./currency";
import { Transaction } from "./transaction";
export type AgentPayment = {
  id: number;
  amountPaid: number;
  agentId: number;
  Agent: Agent;
  currencyId: number;
  Currency: Currency;
  paymentType: string;
  appliedTransactions?: AgentPaymentTransaction[];
  createdAt: Date;
  updatedAt: Date;
};

export type AgentPaymentFormData = {
  tenantId: number;
  agentId: number;
  currencyId: number;
  amountPaid: number;
  paymentType: string;
};

export type DirectAgentPaymentFormData = AgentPaymentFormData & {
  transactionId: number;
  transactionCurrencyId: number;
  exchangeRate: number;
};

export type AgentPaymentTransaction = {
  id: number;
  transactionId: number;
  amountApplied: number;
  createdAt: Date;
  updatedAt: Date;
  AgentTransaction: Transaction;
};
