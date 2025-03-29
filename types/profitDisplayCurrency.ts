import { Currency } from "./currency";

export type ProfitDisplayCurrency = {
  id: number;
  tenantId: number;
  currencyId: number;
  rate: number;
  createdAt: Date;
  updatedAt: Date;
  Currency: Currency;
};

export type ProfitDisplayCurrencyApiResponse = {
  statusCode: number;
  success: boolean;
  data: ProfitDisplayCurrency[];
};
