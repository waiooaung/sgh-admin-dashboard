export type SupplierTransaction = {
  id: number;
  supplierId: string;
  transactionId: number;
  amountUSD: number;
  paidAmountUSD: number;
  amountToPayUSD: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
