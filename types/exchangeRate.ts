export type ExchangeRateFormData = {
  baseCurrency: string;
  quoteCurrency: string;
  buyRate: number;
  sellRate: number;
};

export type Agent = ExchangeRateFormData & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};
