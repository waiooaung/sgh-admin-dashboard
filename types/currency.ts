export type Currency = {
  id: number;
  tenantId: number;
  name: string;
  symbol: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CurrencyApiResponse = {
  statusCode: number;
  success: boolean;
  data: Currency[];
};
