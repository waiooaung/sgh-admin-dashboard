import { Supplier } from "./supplier";
import { SupplierTransaction } from "./supplierTransaction";
export type SupplierPayment = {
  id: number;
  amountPaidUSD: number;
  supplierId: number;
  Supplier: Supplier;
  paymentType: string;
  appliedTransactions?: SupplierPaymentTransaction[];
  createdAt: Date;
  updatedAt: Date;
};

export type SupplierPaymentFormData = {
  supplierId: number;
  amountPaidUSD: number;
  paymentType: string;
};

export type SupplierPaymentTransaction = {
  id: number;
  transactionId: number;
  amountApplied: number;
  createdAt: Date;
  updatedAt: Date;
  SupplierTransaction: SupplierTransaction;
};
