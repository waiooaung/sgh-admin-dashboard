export type CommissionRateFormData = {
  tenantId: number;
  rate: number;
};

export type CommissionRate = CommissionRateFormData & {
  id: number;
  supplierId?: number;
  createdAt: Date;
  updatedAt: Date;
};
