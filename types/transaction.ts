export type Transaction = {
  id: number;
  transactionDate: string;
  amountRMB: number;
  buyRate: number;
  sellRate: number;
  amountUSDBuy: number;
  amountUSDSell: number;
  profitUSD: number;
  commissionRate: number;
  commissionUSD: number;
  totalEarningsUSD: number;
  supplierId: number;
  agentId: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateTransaction = {
  transactionDate: Date;
  amountRMB: number;
  buyRate: number;
  sellRate: number;
  commissionRate: number;
  agentId: number;
  supplierId: number;
};
