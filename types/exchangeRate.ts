import { Currency } from "./currency";
import { MetaData } from "./meta-data";

export type ExchangeRateFormData = {
  tenantId: number;
  baseCurrencyId: number;
  quoteCurrencyId: number;
  name: string;
  buyRate: number;
  sellRate: number;
};

export type ExchangeRate = ExchangeRateFormData & {
  id: number;
  baseCurrency: Currency;
  quoteCurrency: Currency;
  createdAt: Date;
  updatedAt: Date;
};

export interface ExchangeRateApiResponse {
  statusCode: number;
  success: boolean;
  data: ExchangeRate[];
  meta: MetaData;
}
