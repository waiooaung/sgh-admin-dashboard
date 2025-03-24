"use client";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import SupplierPaymentTable from "@/components/tables/supplier-payment-table";
import { AddSupplierPayment } from "@/components/dialogs/add-supplier-payment";
import { mutate } from "swr";
const SupplierPaymentsContainer = () => {
  const handleSubmit = async () => {
    await mutate(
      (key) => typeof key === "string" && key.startsWith("/supplier-payments"),
      undefined,
      { revalidate: true },
    );
  };
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <p className="text-lg font-semibold tracking-tight">
          Supplier Payments
        </p>
        <AddSupplierPayment onSuccess={handleSubmit} />
      </div>

      <div className="grid grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <SupplierPaymentTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierPaymentsContainer;
