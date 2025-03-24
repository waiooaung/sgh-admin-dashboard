export type Supplier = {
  id: number;
  tenantId: number;
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  bankAccount: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateSupplier = {
  tenantId: number;
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  bankAccount: string;
};

export type UpdateSupplier = CreateSupplier & {
  id: number;
};
