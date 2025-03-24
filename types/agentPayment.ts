import { Agent } from "./agent";
import { AgentTransaction } from "./agentTransaction";
export type AgentPayment = {
  id: number;
  amountPaidUSD: number;
  agentId: number;
  Agent: Agent;
  paymentType: string;
  appliedTransactions?: AgentPaymentTransaction[];
  createdAt: Date;
  updatedAt: Date;
};

export type AgentPaymentFormData = {
  tenantId: number;
  agentId: number;
  amountPaidUSD: number;
  paymentType: string;
};

export type AgentPaymentTransaction = {
  id: number;
  transactionId: number;
  amountApplied: number;
  createdAt: Date;
  updatedAt: Date;
  AgentTransaction: AgentTransaction;
};
