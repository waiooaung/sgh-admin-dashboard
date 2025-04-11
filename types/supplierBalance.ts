export type SupplierBalance = {
  id: number;
  agentId: number;
  currencyId: number;
  paidAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SupplierBalanceApiResponse = {
  statusCode: number;
  success: boolean;
  data: SupplierBalance[];
};
