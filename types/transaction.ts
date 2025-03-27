import { Supplier } from "./supplier";
import { Agent } from "./agent";
import { Currency } from "./currency";
export type Transaction = {
  id: number;
  tenantId: number;
  transactionTypeId: number;
  baseCurrencyId: number;
  baseCurrency: Currency;
  quoteCurrencyId: number;
  quoteCurrency: Currency;
  supplierId: number;
  agentId: number;
  transactionDate: string;
  baseAmount: number;
  buyRate: number;
  sellRate: number;
  quoteAmountBuy: number;
  quoteAmountSell: number;
  profit: number;
  commissionRate: number;
  commission: number;
  totalEarnings: number;
  amountReceivedFromAgent: number;
  remainingAmountFromAgent: number;
  agentPaymentStatus: string;
  amountPaidToSupplier: number;
  remainingAmountToPayToSupplier: number;
  supplierPaymentStatus: string;
  createdAt: string;
  updatedAt: string;
};

export type TransactionFormData = {
  tenantId: number;
  transactionTypeId: number;
  baseCurrencyId: number;
  quoteCurrencyId: number;
  agentId: number;
  supplierId: number;
  transactionDate: Date;
  baseAmount: number;
  buyRate: number;
  sellRate: number;
  commissionRate: number;
};

export type UpdateTransaction = TransactionFormData & {
  id: number;
};

export type TransactionDetail = Transaction & {
  supplier: Supplier;
  agent: Agent;
};
