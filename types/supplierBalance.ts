import { Currency } from "./currency";

export type SupplierBalance = {
  id: number;
  agentId: number;
  currencyId: number;
  paidAmount: number;
  createdAt: Date;
  updatedAt: Date;
  currency: Currency;
};

export type SupplierBalanceApiResponse = {
  statusCode: number;
  success: boolean;
  data: SupplierBalance[];
};
