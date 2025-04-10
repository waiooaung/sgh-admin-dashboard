import { Supplier } from "./supplier";
import { Agent } from "./agent";
import { Currency } from "./currency";

export type TransactionProfit = {
  id: number;
  tenantId: number;
  transactionId: number;
  currencyId: number;
  Currency: Currency;
  rate: number;
  profitAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Transaction = {
  id: number;
  tenantId: number;
  transactionTypeId: number;
  baseCurrencyId: number;
  baseCurrency: Currency;
  quoteCurrencyId: number;
  quoteCurrency: Currency;
  supplierId: number;
  Supplier: Supplier;
  Agent: Agent;
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
  TransactionProfit: TransactionProfit[];
};

export type profit = {
  currencyId: number;
  rate: number;
};

export type TransactionFormData = {
  tenantId: number;
  transactionType: string;
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
  profits: profit[];
};

export type UpdateTransaction = TransactionFormData & {
  id: number;
};

export type TransactionDetail = Transaction & {
  Supplier: Supplier;
  Agent: Agent;
};
