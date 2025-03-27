export type TransactionTypeFormData = {
  tenantId: number;
  name: string;
};

export type TransactionType = TransactionTypeFormData & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionTypeApiResponse = {
  statusCode: number;
  success: boolean;
  data: TransactionType[];
};
