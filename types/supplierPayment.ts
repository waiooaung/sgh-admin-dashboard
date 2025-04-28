import { Currency } from "./currency";
import { Supplier } from "./supplier";
import { Transaction } from "./transaction";
export type SupplierPayment = {
  id: number;
  amountPaid: number;
  supplierId: number;
  Supplier: Supplier;
  currencyId: number;
  Currency: Currency;
  paymentType: string;
  appliedTransactions?: SupplierPaymentTransaction[];
  createdAt: Date;
  updatedAt: Date;
};

export type SupplierPaymentFormData = {
  tenantId: number;
  supplierId: number;
  currencyId: number;
  amountPaid: number;
  paymentType: string;
};

export type DirectSupplierPaymentFormData = SupplierPaymentFormData & {
  transactionId: number;
  transactionCurrencyId: number;
  exchangeRate: number;
};

export type SupplierPaymentTransaction = {
  id: number;
  transactionId: number;
  amountApplied: number;
  createdAt: Date;
  updatedAt: Date;
  SupplierTransaction: Transaction;
};
